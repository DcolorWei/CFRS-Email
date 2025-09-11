import { useRef } from "react";
import { addToast, Button, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { StrategyBodyRequest } from "../../../shared/router/StrategyRouter";

interface props {
    isOpen: boolean,
    onOpenChange: any,
    onSubmit: (data: StrategyBodyRequest) => void
}

const EmailAddStrategyModal = ({
    isOpen,
    onOpenChange,
    onSubmit
}: props) => {
    const formRef = useRef<HTMLFormElement>(null);

    const handleCustomSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault();
            return;
        }
        const { email, forward, callback, comment } = Object.fromEntries(new FormData(formRef.current!).entries());
        if (!email || email.toString().includes("@")) {
            return addToast({ title: "邮箱格式错误", color: "danger" })
        }
        console.log(email, forward, callback, comment);
        onSubmit({
            email: email.toString() + "@noworrytourism.cn",
            forward: forward.toString(),
            callback: callback.toString(),
            comment: comment.toString()
        })
    };

    const triggerSubmit = () => {
        handleCustomSubmit();
    };


    const ModalBodyContent = () => {
        return (
            <div className="flex flex-col w-1/2 mx-auto">
                <Form ref={formRef} onSubmit={handleCustomSubmit}>
                    <Input
                        isRequired
                        label="邮箱"
                        name="email"
                        labelPlacement="outside"
                        placeholder="请输入账号"
                        variant="bordered"
                        className="mb-4"
                        endContent={
                            <div className="w-full text-right text-sm text-gray-600"                        >
                                @noworrytourism.cn
                            </div>
                        }
                    />
                    <Input
                        label="转发邮箱"
                        name="forward"
                        labelPlacement="outside"
                        placeholder="默认为本账号"
                        variant="bordered"
                        className="mb-4"
                    />
                    <Input
                        label="回调地址"
                        name="callback"
                        labelPlacement="outside"
                        placeholder="可留空"
                        variant="bordered"
                        className="mb-4"
                    />
                    <Input
                        label="备注"
                        name="comment"
                        labelPlacement="outside"
                        placeholder="用于方便业务区分"
                        variant="bordered"
                    />
                </Form>
            </div>
        )
    }
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-full">
            <ModalContent className="md:min-w-[800px] max-h-[80vh]">
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col">新建邮箱</ModalHeader>
                        <ModalBody className="overflow-y-auto">
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


export default EmailAddStrategyModal;