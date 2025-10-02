"use client";

import React from "react";
import { Button, Input, Checkbox, Link, Form, addToast } from "@heroui/react";
import { AuthRouter } from "../../api/instance";
import { LoginToken } from "../../../shared/router/AuthRouter";
import { useNavigate } from "react-router-dom";

export default function Component() {
    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { email, password } = Object.fromEntries(new FormData(event.currentTarget));
        AuthRouter.login({ email: email.toString(), password: password.toString() });
        window.addEventListener("login", async (e) => {
            const loginResult = (e as CustomEvent).detail as LoginToken;
            if (loginResult.success) {
                addToast({ title: "登录成功", color: "success" });
                await new Promise(r => setTimeout(r, 1000));
                navigate("/email");
                localStorage.setItem("token", email.toString());
            } else {
                addToast({ title: "登录失败，请检查密码", color: "danger" });
            }
        })
    };

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-large flex w-full max-w-sm flex-col gap-4 px-8 pt-[20vh]">
                <p className="pb-4 text-left text-3xl font-semibold">
                    <span aria-label="emoji" className="mr-4" role="img">
                        📮
                    </span>
                    多邮箱系统
                </p>
                <Form className="flex flex-col gap-4" validationBehavior="native" onSubmit={handleSubmit}>
                    <Input
                        isRequired
                        label="邮箱"
                        labelPlacement="outside"
                        name="email"
                        placeholder="请输入账号"
                        type="email"
                        variant="bordered"
                        errorMessage={() => "是的这有些滑稽，你需要先有个邮箱才能使用更多邮箱"}
                    />
                    <Input
                        isRequired
                        label="密码"
                        labelPlacement="outside"
                        name="password"
                        placeholder="请输入密码"
                        type="password"
                        variant="bordered"
                        errorMessage={() => "显然这是必填项"}
                    />
                    <div className="flex w-full items-center justify-end px-1 py-2">
                        <Link className="text-default-500 cursor-pointer" size="sm" onClick={
                            () => addToast({ title: "请联系管理员🙁", color: "danger" })
                        }>
                            忘记密码？
                        </Link>
                    </div>
                    <Button className="w-full" color="primary" type="submit">
                        登录
                    </Button>
                </Form>
            </div>
        </div>
    );
}
