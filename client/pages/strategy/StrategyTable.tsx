import { addToast, Button, Checkbox, closeAll, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { keyLables } from "./StrategyEnums";

const StrategyTable = (params: {
    strategyList: Array<any>,
    setStrategyContentOpen: Function,
    focusStrategy: Function
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
                            <Checkbox disabled color="primary" className="ml-1" />
                        </TableCell>
                        <TableCell className="w-80">
                            <div>{row.callback}</div>
                        </TableCell>
                        <TableCell className="w-80">
                            <div className="">{row.forward}</div>
                        </TableCell>
                        <TableCell className="">
                            <div className="">{row.comment}</div>
                        </TableCell>
                        <TableCell className="w-60">
                            <div className="text-red-400">
                                禁用
                            </div>
                        </TableCell>
                        <TableCell className="w-60 flex flex-row justify-center">
                            <Button
                                size="sm" color="primary" variant="bordered"
                                className="mr-1 h-7 text-primary"
                                onClick={() => { setStrategyContentOpen(true); focusStrategy(row) }}
                            >
                                修改
                            </Button>
                            <Button
                                size="sm" color="danger" variant="bordered"
                                className="h-7 text-danger"
                                onClick={() => { toDelete(row) }}
                            >
                                删除
                            </Button>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default StrategyTable;