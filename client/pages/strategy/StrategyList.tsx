import { Button, Card, CardBody, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { keyLables } from "./StrategyEnums";
import { StrategyImpl } from "../../../shared/impl";

const StrategyList = (params: {
    strategyList: Array<any>,
    setStrategyContentOpen: Function,
    focusStrategy: Function
}) => {
    const { strategyList, setStrategyContentOpen, focusStrategy } = params;
    return (
        <div id="strategy-list" className="flex flex-col">
            {strategyList.map(email => {
                return (<Card className="w-full max-w-full my-1">
                    <CardBody className="max-w-[90vw] mx-auto">
                        <div className="flex flex-col md:flex-row md:justify-start md:items-center">
                            <div className="flex flex-row items-center mt-1">
                                <Chip color="primary" variant="bordered" className="text-primary">
                                    <div className="w-8 text-center">邮箱</div>
                                </Chip>
                                <div className="text-sm ml-1">
                                    <span className="mr-1">
                                        {email.email}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-row items-center mt-1 md:ml-5">
                                <Chip color="primary" variant="bordered" className="text-primary">
                                    <div className="w-8 text-center">转发</div>
                                </Chip>
                                <div className="text-sm ml-1">{email.forward}</div>
                            </div>
                            <div className="flex flex-row justify-between items-center mt-1 md:ml-5">
                                <div className="flex flex-row items-center">
                                    <Chip color="primary" variant="bordered" className="text-primary">
                                        <div className="w-8 text-center">回调</div>
                                    </Chip>
                                    <div className="text-sm ml-1">{email.callback}</div>
                                </div>
                                <Button
                                    size="sm" color="primary"
                                    variant="bordered"
                                    className="h-7 text-primary"
                                    onClick={() => { setStrategyContentOpen(true); focusStrategy(email) }}
                                >
                                    查看
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>)
            })}
        </div>
    )
}

export default StrategyList;