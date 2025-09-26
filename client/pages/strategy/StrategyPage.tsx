import { Header } from "../../components/header/Header";
import { useEffect, useState } from "react";
import { StrategyRouter } from "../../api/instance";
import { Button, Checkbox, Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react";
import { keyLables } from "./StrategyEnums";
import StrategyContentModal from "./StrategyContent";
import { StrategyBodyRequest, StrategyListResponse } from "../../../shared/router/StrategyRouter";
import { StrategyImpl } from "../../../shared/impl";
import StrategyList from "./StrategyList";
import StrategyTable from "./StrategyTable";

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
                <div className="w-full hidden md:block">
                    <StrategyTable
                        strategyList={strategyList}
                        setStrategyContentOpen={setStrategyContentOpen}
                        focusStrategy={setFocusStrategy}
                    />
                </div>
                <div className="w-full block sm:hidden">
                    <StrategyList
                        strategyList={strategyList}
                        setStrategyContentOpen={setStrategyContentOpen}
                        focusStrategy={setFocusStrategy}
                    />
                </div>
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