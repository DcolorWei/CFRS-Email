import { Header } from "../../components/header/Header";
import { useState } from "react";
import { addToast, Button, Card, CardBody, Input, Textarea } from "@heroui/react";
import SendEditor from "./SendEditor";
import { EmailRouter } from "../../api/instance";

const SenderPage = () => {
    const emailhost = "@noworrytourism.cn";
    const [name, setName] = useState("");
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [html, setHtml] = useState("");
    const [justSend, setJustSend] = useState(false);

    async function sendEmail() {
        if (name.length < 2) return addToast({ title: "请填写发件邮箱", color: "danger" });
        if (to.length < 2 || !to.includes("@")) return addToast({ title: "请填写正确的邮箱地址", color: "danger" });
        if (!subject.length) return addToast({ title: "请填写邮件标题", color: "danger" });
        if (!html.length) return addToast({ title: "请填写邮件内容", color: "danger" });
        if (justSend) return addToast({ title: "发送频率过高，请稍等", color: "danger" });
        setJustSend(true);
        setTimeout(() => setJustSend(false), 5000);
        EmailRouter.requestSendMail({ name, to, subject, html }, () => {
            return addToast({ title: "发送成功", color: "primary" });
        })
    }
    return (
        <div className="max-w-screen">
            <Header name="发送邮件" />
            <div className="w-full flex flex-col flex-wrap px-[5vw] pt-6">
                <Card className="mb-2">
                    <CardBody className="flex flex-row">
                        <Input
                            label="收件人"
                            placeholder="请输入邮箱"
                            className="w-2/5 mr-6"
                            variant="underlined"
                            value={to}
                            onValueChange={setTo}
                        />
                        <Input
                            label="主题"
                            placeholder="请输入主题"
                            variant="underlined"
                            value={subject}
                            onValueChange={setSubject}
                        />
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Textarea
                            label="内容"
                            placeholder="请输入内容"
                            variant="bordered"
                            value={html}
                            minRows={12}
                            onValueChange={setHtml}
                        />
                    </CardBody>
                </Card>
                <div className="w-100 mt-5 flex flex-row justify-between items-center">
                    <Input
                        placeholder="发件邮箱"
                        className="w-2/3 mr-6"
                        variant="underlined"
                        endContent={<div className="w-full text-sm text-gray-600">{emailhost}</div>}
                        value={name}
                        onValueChange={setName}
                    />
                    <Button
                        color={(justSend || !name.length) ? "default" : "primary"}
                        className="w-30" onClick={sendEmail}
                    >
                        发送邮件
                    </Button>
                </div>
            </div>
        </div>
    )
};


export default SenderPage;