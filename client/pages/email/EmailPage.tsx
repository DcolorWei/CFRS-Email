import { Header } from "../../components/header/Header";
import { useEffect, useState } from "react";
import { EmailImpl } from "../../../shared/impl";
import { EmailRouter, EmailWebsocket, StrategyRouter } from "../../api/instance";
import { addToast, Button, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react";
import { keyLables } from "./EmailEnums";
import EmailContentModal from "./EmailContent";
import { EmailListResponse } from "../../../shared/router/EmailRouter";
import EmailAddStrategyModal from "./EmailAddStrategy";
import { StrategyBodyRequest } from "../../../shared/router/StrategyRouter";

const EmailPage = () => {
    const [allEmailList, setAllEmailList] = useState<EmailImpl[]>([]);
    const [showEmailList, setShowEmailList] = useState<EmailImpl[]>([]);

    const [focusEmail, setFocusEmail] = useState<EmailImpl | null>(null);
    const [isEmailContentOpen, setEmailContentOpen] = useState(false);
    const [isEmailAddStrategyOpen, setEmailAddStrategyOpen] = useState(false);

    const [accountList, setAccountList] = useState<Array<string>>([]);
    const [filterTo, setFilterTo] = useState<Array<string>>([]);

    function setFilter(value: Array<string>) {
        setFilterTo(value);
        console.log(value);
        const els = allEmailList.filter(i => value.length ? value.includes(i.to) : true);
        setShowEmailList(els);
    }

    function submitAddStrategy(body: StrategyBodyRequest) {
        StrategyRouter.requestSaveStrategy(body, () => {
            addToast({ title: "添加成功", color: "primary" });
            setEmailAddStrategyOpen(false);
        })
    }

    useEffect(() => {
        EmailRouter.queryEmailList({ page: 1 }, (data: EmailListResponse) => {
            setAllEmailList(data.list);
            setShowEmailList(data.list);
            const accountList = Array.from(new Set(data.list.map((email) => email.to)));
            setAccountList(accountList);
        });
        setInterval(() => {
            EmailRouter.queryEmailList({ page: 1 }, (data: EmailListResponse) => {
                if (data.list.length !== allEmailList.length) {
                    setAllEmailList(data.list);
                    setShowEmailList(data.list);
                    const accountList = Array.from(new Set(data.list.map((email) => email.to)));
                    setAccountList(accountList);
                }
            });
        }, 10 * 1000)
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
                            className="w-1/3"
                            label="筛选收件人"
                            size="sm"
                            selectedKeys={filterTo}
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
                    <Button onClick={() => setEmailAddStrategyOpen(true)} color="primary" className="text-white">
                        新建邮箱
                    </Button>
                </div>
                <Table aria-label="table" isStriped>
                    <TableHeader>
                        {keyLables.map((item, index) => {
                            return (
                                <TableColumn key={index} align="center">{item.label}</TableColumn>
                            )
                        })}
                    </TableHeader>
                    <TableBody>
                        {showEmailList.map((row, index) =>
                            <TableRow key={index}>
                                <TableCell className="w-50">
                                    <div>
                                        <div className="mr-1">
                                            {row.from.split(" <")[0].replace(/[\"]/g, "")}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {row.from.split(" <").length > 1 ? "(" + row.from.split(" <")?.[1]?.replace(/[<>]/g, "") + ")" : ""}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="w-50">
                                    <div>{row.to}</div>
                                </TableCell>
                                <TableCell className="80">
                                    <div>{row.subject}</div>
                                </TableCell>
                                <TableCell className="max-w-120">
                                    <span>{row.text.slice(0, window.innerWidth / 50)}</span>
                                    <span>{row.text.length > window.innerWidth / 50 ? "......" : ""}</span>
                                </TableCell>

                                <TableCell className="w-30">
                                    <div>
                                        {new Date(Number(row.time)).toLocaleDateString().slice(5) + " "}
                                        {new Date(Number(row.time)).toLocaleTimeString().slice(0, -3)}
                                    </div>
                                </TableCell>
                                <TableCell className="w-20">
                                    <Button
                                        size="sm" color="primary"
                                        className="h-7 text-white"
                                        onClick={() => { setEmailContentOpen(true); setFocusEmail(row) }}
                                    >
                                        查看
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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
                    onOpenChange={setEmailAddStrategyOpen}
                    onSubmit={submitAddStrategy}
                />
            }
        </div >
    )
};


export default EmailPage;