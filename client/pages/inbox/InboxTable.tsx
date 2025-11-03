import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { keyLables } from "./InboxEnums";
import { formatEmail } from "../../methods/format";


const InboxTable = (params: {
    emailList: Array<any>,
    setEmailContentOpen: Function,
    setFocusEmail: Function
}) => {
    const { emailList, setEmailContentOpen, setFocusEmail } = params;
    return (
        <Table aria-label="table" isStriped>
            <TableHeader>
                {keyLables.map((item, index) => {
                    return (
                        <TableColumn key={index} align="center">{item.label}</TableColumn>
                    )
                })}
            </TableHeader>
            <TableBody>
                {emailList.map((email, index) =>
                    <TableRow key={index}>
                        <TableCell className="w-50">
                            <div>
                                <div className="mr-1">
                                    <span className="whitespace-nowrap">
                                        {formatEmail(email.from).name}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-400">
                                    <span className="whitespace-nowrap">
                                        {formatEmail(email.from).email}
                                    </span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="w-50">
                            <div className="text-sm ml-1">
                                {email.to.split(", ").map((item: string, index: number) => {
                                    return (
                                        <p key={index} className="whitespace-nowrap">
                                            <span className="whitespace-nowrap">
                                                {formatEmail(item).email}
                                            </span>
                                        </p>
                                    )
                                })}

                            </div>
                        </TableCell>
                        <TableCell className="80">
                            <div>{email.subject}</div>
                        </TableCell>
                        <TableCell className="max-w-120">
                            <span>{email.text?.slice(0, window.innerWidth / 50)}</span>
                            <span>{email.text?.length > window.innerWidth / 50 ? "......" : ""}</span>
                        </TableCell>

                        <TableCell className="w-30">
                            <div>
                                {new Date(Number(email.time)).toLocaleDateString()?.slice(5) + " "}
                                {new Date(Number(email.time)).toLocaleTimeString()?.slice(0, -3)}
                            </div>
                        </TableCell>
                        <TableCell className="w-20">
                            <Button
                                size="sm" color="primary"
                                variant="bordered"
                                className="h-7 text-primary"
                                onClick={() => { setEmailContentOpen(true); setFocusEmail(email) }}
                            >
                                查看
                            </Button>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default InboxTable;