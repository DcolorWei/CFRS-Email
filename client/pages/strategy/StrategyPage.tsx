import { Header } from "../../components/header/Header";
import { useEffect, useState } from "react";
import { EmailImpl } from "../../../shared/impl";
import { EmailRouter } from "../../api/instance";
import { addToast, Button, Checkbox, Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react";
import { keyLables } from "./StrategyEnums";
import EmailContentModal from "./StrategyContent";
import { WebSocketClientService } from "../../lib/websocket";

const StrategyPage = () => {
    const wsService = WebSocketClientService.getInstance("ws://localhost:61027");

    const [emailList, setEmailList] = useState<string[]>([]);
    const [focusEmail, setFocusEmail] = useState<string | null>(null);
    const [isEmailContentOpen, setEmailContentOpen] = useState(false);

    const [filterTo, setFilterTo] = useState<Array<string>>([]);

    async function getRandomEmail() {
        // 复制文本到剪贴板
        await new Promise((resolve) => setTimeout(resolve, 500));
        const email = Date.now().toString(36) + "@noworrytourism.cn";
        navigator.clipboard.writeText(email);

    }
    useEffect(() => {
        EmailRouter.queryEmailList({ page: 1 }).then(res => {
            const emailSet = new Set(Array.from(res.list.map(i => i.to)));
            setEmailList(Array.from(emailSet));
        });
    }, [])

    return (
        <div className="max-w-screen">
            <Header name="邮箱策略" />
            <div className="w-full flex flex-col flex-wrap px-[5vw] pt-6">
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
                            <TableRow key={row}>
                                <TableCell className="w-80">
                                    <div>
                                        <span className="mr-1">
                                            {row.split(" ")[0].replace(/[\"]/g, "")}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="w-40">
                                    <Checkbox color="primary" className="ml-1" />
                                </TableCell>
                                <TableCell className="w-120">
                                    <div>https://test_api.plumend.cn/callback</div>
                                </TableCell>
                                <TableCell className="w-120">
                                    <div className="">
                                        corfer@yeah.net
                                    </div>
                                </TableCell>

                                <TableCell className="w-60">
                                    <div className="text-red-400">
                                        禁用
                                    </div>
                                </TableCell>
                                <TableCell className="w-20">
                                    <Button
                                        size="sm" color="primary"
                                        className="h-7 text-white font-bold"
                                        onClick={() => { setEmailContentOpen(true); setFocusEmail(row) }}
                                    >
                                        修改
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


export default StrategyPage;