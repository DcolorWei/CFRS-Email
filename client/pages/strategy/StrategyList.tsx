import { addToast, Button, Card, CardBody, Chip, closeAll } from "@heroui/react";

const StrategyList = (params: {
    strategyList: Array<any>,
    setStrategyContentOpen: Function,
    focusStrategy: Function,
    deleteStrategy: Function
}) => {
    const { strategyList, setStrategyContentOpen, focusStrategy, deleteStrategy } = params;

    function toDelete(email: any) {
        addToast({
            title: "仅删除策略，邮箱仍会保留",
            hideIcon: true,
            hideCloseButton: true,
            endContent: (
                <Button
                    color="danger" size="sm" variant="bordered"
                    onClick={() => { deleteStrategy(email); closeAll(); }}
                >
                    确认删除
                </Button>
            ),
        })
    }
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
                                        <div className="w-8 text-center">备注</div>
                                    </Chip>
                                    <div className="text-sm ml-1">{email.comment || "--"}</div>
                                </div>
                                <div className="flex flex-row items-center">
                                    <Button
                                        size="sm" color="primary"
                                        variant="bordered"
                                        className="h-7 mr-1 text-primary"
                                        onClick={() => { setStrategyContentOpen(true); focusStrategy(email) }}
                                    >
                                        修改
                                    </Button>
                                    <Button
                                        size="sm" color="danger" variant="bordered"
                                        className="h-7 text-danger"
                                        onClick={() => toDelete(email)}
                                    >
                                        删除
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </CardBody>
                </Card>)
            })}
        </div>
    )
}

export default StrategyList;