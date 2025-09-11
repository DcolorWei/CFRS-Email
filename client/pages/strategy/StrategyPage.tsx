import { Header } from "../../components/header/Header";
import { useEffect, useState } from "react";
import { StrategyRouter } from "../../api/instance";
import { Button, Checkbox, Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react";
import { keyLables } from "./StrategyEnums";
import StrategyContentModal from "./StrategyContent";
import { StrategyBodyRequest, StrategyListResponse } from "../../../shared/router/StrategyRouter";
import { StrategyImpl } from "../../../shared/impl";

const StrategyPage = () => {
    const [strategyList, setStrategyList] = useState<StrategyImpl[]>([]);
    const [focusStrategy, setFocusStrategy] = useState<StrategyImpl | null>(null);
    const [isStrategyContentOpen, setStrategyContentOpen] = useState(false);

    function submitSaveStrategy(body: StrategyBodyRequest) {
        StrategyRouter.requestSaveStrategy(body);
        StrategyRouter.queryStrategyList({ page: 1 }, (res: StrategyListResponse) => {
            setStrategyContentOpen(false);
            setStrategyList(res.list);
        });
    }

    useEffect(() => {
        StrategyRouter.queryStrategyList({ page: 1 }, (data: StrategyListResponse) => {
            setStrategyList(data.list);
        })
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
                        {strategyList.map((row, index) =>
                            <TableRow key={index}>
                                <TableCell className="w-80">
                                    <div>
                                        <span className="mr-1">
                                            {row.email.split(" ")[0].replace(/[\"]/g, "")}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="w-40">
                                    <Checkbox color="primary" className="ml-1" />
                                </TableCell>
                                <TableCell className="w-120">
                                    <div>{row.callback}</div>
                                </TableCell>
                                <TableCell className="w-120">
                                    <div className="">{row.forward}</div>
                                </TableCell>
                                <TableCell className="w-120">
                                    <div className="">{row.comment}</div>
                                </TableCell>
                                <TableCell className="w-60">
                                    <div className="text-red-400">
                                        禁用
                                    </div>
                                </TableCell>
                                <TableCell className="w-20">
                                    <Button
                                        size="sm" color="primary" variant="bordered"
                                        className="h-7 text-primary"
                                        onClick={() => { setStrategyContentOpen(true); setFocusStrategy(row) }}
                                    >
                                        修改
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {focusStrategy && <StrategyContentModal
                email={focusStrategy}
                isOpen={isStrategyContentOpen}
                onOpenChange={setStrategyContentOpen}
                onSubmit={submitSaveStrategy}
            />}
        </div>
    )
};


export default StrategyPage;