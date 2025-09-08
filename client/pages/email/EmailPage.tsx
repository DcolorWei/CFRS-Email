import { Header } from "../../components/header/Header";
import { useEffect, useState } from "react";
import { EmailImpl } from "../../../shared/impl";
import { EmailRouter, EmailWebsocket } from "../../api/instance";
import { addToast, Button, Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react";
import { keyLables } from "./EmailEnums";
import EmailContentModal from "./EmailContent";
import { WebSocketClientService } from "../../lib/websocket";

const EmailPage = () => {
    const [allEmailList, setAllEmailList] = useState<EmailImpl[]>([]);
    const [showEmailList, setShowEmailList] = useState<EmailImpl[]>([]);

    const [focusEmail, setFocusEmail] = useState<EmailImpl | null>(null);
    const [isEmailContentOpen, setEmailContentOpen] = useState(false);

    const [accountList, setAccountList] = useState<Array<string>>([]);
    const [filterTo, setFilterTo] = useState<Array<string>>([]);

    async function getRandomEmail() {
        // 复制文本到剪贴板
        await new Promise((resolve) => setTimeout(resolve, 500));
        const email = Date.now().toString(36) + "@noworrytourism.cn";
        navigator.clipboard.writeText(email);

        addToast({
            title: `新邮箱 ${email} 已复制`,
            color: "success",
        });
    }

    function setFilter(value: Array<string>) {
        setFilterTo(value);
        console.log(value);
        const els = allEmailList.filter(i => value.length ? value.includes(i.to) : true);
        setShowEmailList(els);
    }

    useEffect(() => {
        EmailRouter.queryEmailList({ page: 1 });
        EmailWebsocket.queryEmailList({ page: 1 });
        window.addEventListener('queryEmailList', function (event) {
            const detail: { list: Array<EmailImpl> } = event["detail"];
            setAllEmailList(detail.list);
            setShowEmailList(detail.list);
            const accountList = Array.from(new Set(detail.list.map((email) => email.to)));
            setAccountList(accountList);
        });
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
                    <Button onClick={getRandomEmail} color="primary" className="text-white">
                        获取新邮箱
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
                                            {row.from.split(" ")[0].replace(/[\"]/g, "")}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {row.from.split(" ").length > 1 ? "(" + row.from.split(" ")?.[1]?.replace(/[<>]/g, "") + ")" : ""}
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
        </div >
    )
};


export default EmailPage;