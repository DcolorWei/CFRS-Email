import { EmailImpl } from "../../../shared/impl";
import {  Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

interface props {
    email: EmailImpl,
    isOpen: boolean,
    onOpenChange: any,
}

const InboxContentModal = ({
    email,
    isOpen,
    onOpenChange,
}: props) => {
    const ModalBodyContent = () => {
        return (
            <div className="flex flex-col">
                <div className="flex flex-row justify-start items-center">
                    <div className="flex flex-row items-center">
                        <Chip color="primary" variant="bordered" className="text-primary">
                            <div className="w-12 text-center">发件人</div>
                        </Chip>
                        <div className="text-sm ml-1">
                            <span className="mr-1">
                                {email.from.split(" <")[0].replace(/[\"]/g, "")}
                            </span>
                            <span className="text-gray-500">
                                {email.from.split(" <").length > 1 ? "(" + email.from.split(" <")?.[1]?.replace(/[<>]/g, "") + ")" : ""}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-row items-center ml-5">
                        <Chip color="primary" variant="bordered" className="text-primary">
                            <div className="w-12 text-center">收件人</div>
                        </Chip>
                        <div className="text-sm ml-1">{email.to}</div>
                    </div>
                    <div className="flex flex-row items-center ml-5">
                        <Chip color="primary" variant="bordered" className="text-primary">
                            <div className="w-12 text-center">时间</div>
                        </Chip>
                        <div className="text-sm ml-1">
                            {new Date(Number(email.time)).toLocaleDateString() + " "}
                            {new Date(Number(email.time)).toLocaleTimeString().slice(0, -3)}
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    <div className="flex flex-row items-center">
                        <Chip color="primary" variant="bordered" className="text-primary">
                            <div className="w-12 text-center">标题</div>
                        </Chip>
                        <div className="text-sm ml-1">{email.subject}</div>
                    </div>
                    <div className="flex flex-col items-start mt-3">
                        <Chip color="primary" variant="bordered" className="text-primary">
                            <div className="w-12 text-center">正文</div>
                        </Chip>
                        <div
                            className="border-1 border-gray-300 rounded-lg p-2 mt-2 w-full overflow-auto"
                            dangerouslySetInnerHTML={{ __html: email.html }}
                        />
                    </div>
                </div>
            </div>
        )
    }
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-full">
            <ModalContent className="md:min-w-[80vw] max-h-[80vh]">
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col">邮件详情</ModalHeader>
                        <ModalBody className="overflow-y-auto">
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


export default InboxContentModal;