import { Header } from "../../components/header/Header";
import { useEffect, useState } from "react";
import { EmailImpl } from "../../../shared/impl";
import { EmailRouter } from "../../api/instance";
import { addToast, Button, Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react";
import { keyLables } from "./EmailEnums";
import EmailContentModal from "./EmailContent";
import { wsService } from "../../lib/websocket";
"#1c66cb"
"#014ACF"
const EmailPage = () => {
    const [emailList, setEmailList] = useState<EmailImpl[]>([]);
    const [focusEmail, setFocusEmail] = useState<EmailImpl | null>(null);
    const [isEmailContentOpen, setEmailContentOpen] = useState(false);

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
    useEffect(() => {
        EmailRouter.queryEmailList({ page: 1 }).then(res => {
            setEmailList(res.list);
        });
    }, [])

    return (
        <div className="max-w-screen">
            <Header name="邮件列表" />
            <div className="w-full flex flex-col flex-wrap px-[5vw] pt-6">
                <div className="flex flex-row justify-between items-center w-full py-3">
                    <div className="flex-row">
                        <div className="w-32 text-sm mr-2">Filter Reciever</div>
                        <Select
                            aria-label="select" variant="bordered" multiple
                            defaultSelectedKeys={filterTo}
                            onSelectionChange={(value) => {
                                console.log(value);
                            }}
                        >
                            {Array.from(new Set(emailList.map((email) => email.to))).map((email) => (
                                <SelectItem key={email}>{email}</SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div className="mt-5">
                        <Button onClick={getRandomEmail} color="primary" className="h7 text-white">
                            获取新邮箱
                        </Button>
                    </div>
                </div>
                <Table aria-label="table" isStriped>
                    <TableHeader>
                        {keyLables.map((item) => {
                            return (
                                <TableColumn key={item.key} align="center">{item.label}</TableColumn>
                            )
                        })}
                    </TableHeader>
                    <TableBody>
                        {emailList.map((row) =>
                            <TableRow key={row.from + row.to + row.time}>
                                <TableCell className="w-50">
                                    <div>
                                        <span className="mr-1">
                                            {row.from.split(" ")[0].replace(/[\"]/g, "")}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            ({row.from.split(" ")[1].replace(/[<>]/g, "")})
                                        </span>
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
            {focusEmail && <EmailContentModal
                email={focusEmail}
                isOpen={isEmailContentOpen}
                onOpenChange={setEmailContentOpen}
            />}
        </div>
    )
};


export default EmailPage;