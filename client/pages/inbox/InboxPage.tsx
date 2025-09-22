import { Header } from "../../components/header/Header";
import { useEffect, useState } from "react";
import { EmailImpl } from "../../../shared/impl";
import { EmailRouter, StrategyRouter } from "../../api/instance";
import { addToast, Button, Select, SelectItem } from "@heroui/react";
import EmailContentModal from "./InboxContent";
import { EmailListResponse } from "../../../shared/router/EmailRouter";
import EmailAddStrategyModal from "./InboxAddStrategy";
import { StrategyBodyRequest } from "../../../shared/router/StrategyRouter";
import InboxTable from "./InboxTable";
import InboxList from "./InboxList";

const EmailPage = () => {
    const [allEmailList, setAllEmailList] = useState<EmailImpl[]>([]);
    const [showEmailList, setShowEmailList] = useState<EmailImpl[]>([]);

    const [focusEmail, setFocusEmail] = useState<EmailImpl | null>(null);
    const [isEmailContentOpen, setEmailContentOpen] = useState(false);
    const [isEmailAddStrategyOpen, setEmailAddStrategyOpen] = useState(false);

    const [accountList, setAccountList] = useState<Array<string>>([]);

    function setFilter(value: Array<string>) {
        localStorage.setItem("filters", JSON.stringify(value));
        const els = allEmailList.filter(i => value.length ? value.includes(i.to) : true);
        setShowEmailList(els);
    }

    function submitAddStrategy(body: StrategyBodyRequest) {
        StrategyRouter.requestSaveStrategy(body, () => {
            addToast({ title: "添加成功", color: "primary" });
            setEmailAddStrategyOpen(false);
        });
    }

    // NOTE: callback hell !!!
    function renderEmail(data: EmailListResponse) {
        if (localStorage.getItem("pause") === "1") return;
        setAllEmailList(data.list);
        const filters = localStorage.getItem("filters");
        if (!filters) {
            setShowEmailList(data.list);
            return;
        } else {
            // Filter To with check no-filter-flag
            const ft = JSON.parse(filters);
            const nff = ft.length == 0;
            const els = data.list.filter(i => (nff || ft.includes(i.to)));
            setShowEmailList(els);
        }

        const accountList = Array.from(new Set(data.list.map((email) => email.to)));
        setAccountList(accountList);
    }

    useEffect(() => {
        EmailRouter.queryEmailList({ page: 1 }, renderEmail);
        setInterval(() => EmailRouter.queryEmailList({ page: 1 }, renderEmail), 30 * 1000);
    }, [])

    return (
        <div className="max-w-screen">
            <Header name="邮件列表" />
            <div className="w-full flex flex-col flex-wrap px-[5vw] pt-6">
                <div className="flex flex-row justify-between items-center w-full py-3">
                    <div className="flex-row w-full">
                        <Select
                            aria-label="select"
                            variant="bordered"
                            selectionMode="multiple"
                            className="w-4/5 md:w-1/3"
                            label="筛选"
                            size="sm"
                            defaultSelectedKeys={
                                JSON.parse(localStorage.getItem("filters") || "[]")
                            }
                            onSelectionChange={(value) => setFilter(Array.from(value).map(i => {
                                console.log(value);
                                return i.toString();
                            }))}
                        >
                            {accountList.map((email) => (
                                <SelectItem key={email}>{email}</SelectItem>
                            ))}
                        </Select>
                    </div>
                    <Button
                        onClick={() => {
                            setEmailAddStrategyOpen(true);
                            localStorage.setItem("pause", "1");
                        }}
                        color="primary" variant="bordered" className="text-primary"
                    >
                        新建邮箱
                    </Button>
                </div>
                <div className="w-full hidden md:block">
                    <InboxTable
                        emailList={showEmailList}
                        setEmailContentOpen={setEmailContentOpen}
                        setFocusEmail={setFocusEmail}
                    />
                </div>
                <div className="w-full block sm:hidden">
                    <InboxList
                        emailList={showEmailList}
                        setEmailContentOpen={setEmailContentOpen}
                        setFocusEmail={setFocusEmail}
                    />
                </div>
            </div>
            {
                focusEmail && <EmailContentModal
                    email={focusEmail}
                    isOpen={isEmailContentOpen}
                    onOpenChange={setEmailContentOpen}
                />
            }
            {
                <EmailAddStrategyModal
                    isOpen={isEmailAddStrategyOpen}
                    onOpenChange={(v: boolean) => {
                        if (!v) localStorage.setItem("pause", "0");
                        setEmailAddStrategyOpen(v);
                    }}
                    onSubmit={submitAddStrategy}
                />
            }
        </div >
    )
};


export default EmailPage;