import { Header } from "../../components/header/Header";
import { addToast, Button, Checkbox, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea, Tooltip } from "@heroui/react";
import { keyLables } from "./StrategyEnums";

interface props {
    email: string,
    isOpen: boolean,
    onOpenChange: any,
}

const EmailContentModal = ({
    email,
    isOpen,
    onOpenChange,
}: props) => {
    const ModalBodyContent = () => {
        return (
            <div className="flex flex-col">
                <div className="w-full flex flex-col justify-start items-center gap-1">
                    <div className="w-1/2 flex flex-row justify-beyween items-center">
                        <Input
                            label="邮箱"
                            variant="bordered"
                            readOnly
                            value={email}
                        />
                    </div>
                    <div className="w-1/2 flex flex-row justify-beyween items-center">
                        <Select
                            label="站内通知"
                            defaultSelectedKeys={["关闭"]}
                            variant="bordered"
                        >
                            <SelectItem key="启用" textValue="启用">启用</SelectItem>
                            <SelectItem key="关闭" textValue="关闭">关闭</SelectItem>
                        </Select>
                    </div>
                    <div className="w-1/2 flex flex-row justify-beyween items-center">
                        <Input
                            label="转发邮箱"
                            variant="bordered"
                            defaultValue={"corfer@yeah.net"}
                        />
                    </div>
                    <div className="w-1/2 flex flex-row justify-beyween items-center">
                        <Input
                            label="回调地址"
                            variant="bordered"
                            defaultValue={"https://test_api.plumend.cn/callback"}
                        />
                    </div>
                </div>
            </div>
        )
    }
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-full">
            <ModalContent className="md:min-w-[800px]">
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col">邮件详情</ModalHeader>
                        <ModalBody>
                            <ModalBodyContent />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" size="sm" variant="light" onPress={onClose}>
                                关闭
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
};


export default EmailContentModal;