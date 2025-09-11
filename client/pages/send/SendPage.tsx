import { Header } from "../../components/header/Header";
import { useState } from "react";
import { addToast, Button, Card, CardBody, Input } from "@heroui/react";
import SendEditor from "./SendEditor";
import { EmailRouter } from "../../api/instance";

const SenderPage = () => {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [html, setHtml] = useState("");
    const [justSend, setJustSend] = useState(false);

    async function sendEmail() {
        if (to.length < 2 || !to.includes("@")) return addToast({ title: "请填写正确的邮箱地址", color: "danger" });
        if (!subject.length) return addToast({ title: "请填写邮件标题", color: "danger" });
        if (!html.length) return addToast({ title: "请填写邮件内容", color: "danger" });
        if (justSend) return addToast({ title: "发送频率过高，请稍等", color: "danger" });
        setJustSend(true);
        setTimeout(() => setJustSend(false), 5000);
        EmailRouter.requestSendMail({ to, subject, html }, () => {
            addToast({ title: "发送成功", color: "primary" });
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
                        <SendEditor content={html} onChange={setHtml}></SendEditor>
                    </CardBody>
                </Card>
                <div className="w-64 mt-5 flex flex-row justify-between items-center">
                    <Button
                        color={justSend ? "default" : "primary"}
                        className="w-30" onClick={sendEmail}
                    >
                        发送邮件
                    </Button>
                    <div className="text-sm text-gray-500">(使用默认发送邮箱)</div>
                </div>
            </div>
        </div>
    )
};


export default SenderPage;