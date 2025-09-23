import { addToast, Button, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@heroui/react";
import { StrategyImpl } from "../../../shared/impl";
import { useRef } from "react";
import { StrategyBodyRequest } from "../../../shared/router/StrategyRouter";

interface props {
    email: StrategyImpl,
    isOpen: boolean,
    onOpenChange: any,
    onSubmit: (data: StrategyBodyRequest) => void
}

const EmailContentModal = ({
    email,
    isOpen,
    onOpenChange,
    onSubmit
}: props) => {
    const ModalBodyContent = () => {
        return (
            <div className="flex flex-col">
                <div className="w-full flex flex-col justify-start items-center gap-1">
                    <Form className="w-full md:w-1/2 mx-auto" ref={formRef} onSubmit={handleCustomSubmit}>
                        <div className="w-full flex flex-row justify-beyween items-center">
                            <Input
                                label="邮箱"
                                name="email"
                                variant="bordered"
                                labelPlacement="outside"
                                readOnly
                                defaultValue={email.email}
                            />
                        </div>
                        <div className="w-full flex flex-row justify-beyween items-center">
                            <Select
                                label="站内通知"
                                labelPlacement="outside"
                                defaultSelectedKeys={["关闭"]}
                                variant="bordered"
                            >
                                <SelectItem key="启用" textValue="启用">启用</SelectItem>
                                <SelectItem key="关闭" textValue="关闭">关闭</SelectItem>
                            </Select>
                        </div>
                        <div className="w-full flex flex-row justify-beyween items-center">
                            <Input
                                label="转发邮箱"
                                name="forward"
                                placeholder="默认为本账号"
                                variant="bordered"
                                labelPlacement="outside"
                                defaultValue={email.forward}
                            />
                        </div>
                        <div className="w-full flex flex-row justify-beyween items-center">
                            <Input
                                label="回调地址"
                                name="callback"
                                placeholder="可留空"
                                variant="bordered"
                                labelPlacement="outside"
                                defaultValue={email.callback}
                            />
                        </div>
                        <div className="w-full flex flex-row justify-beyween items-center">
                            <Input
                                label="备注"
                                name="comment"
                                placeholder="用于方便业务区分"
                                labelPlacement="outside"
                                variant="bordered"
                                defaultValue={email.comment}
                            />
                        </div>
                    </Form>
                </div>
            </div>
        )
    }

    const formRef = useRef<HTMLFormElement>(null);

    const handleCustomSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault();
            return;
        }
        const { email, forward, callback, comment } = Object.fromEntries(new FormData(formRef.current!).entries());

        onSubmit({
            email: email.toString(),
            forward: forward.toString(),
            callback: callback.toString(),
            comment: comment.toString()
        })
    };

    const triggerSubmit = () => {
        handleCustomSubmit();
    };

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
                            <Button color="primary" size="sm" variant="light" onPress={triggerSubmit}>
                                保存
                            </Button>
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