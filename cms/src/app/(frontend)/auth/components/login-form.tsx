'use client';
import { emailSchema, passwordSchema } from "@/validations/fields";
import { Button, cn, Description, ErrorMessage, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { loginHandler } from "../../services/auth-api";
import { authStore } from "../../store/auth-store";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        const rawData: any = Object.fromEntries(formData.entries())
        const result = await loginHandler(rawData)
        if (result.token) {
          localStorage.setItem('payload-token', result.token)
          authStore.set('state', { isAuth: true, jwt: result.token })
          // Đăng nhập thành công, chuyển hướng người dùng
          router.push('/')
          router.refresh()
        }
      } catch (err: any) {
        console.error('Lỗi đăng nhập:', err)
        authStore.set('reset')
        if (err?.status === 401) {
          setError(tForm('unauthorized'))
        } else {
          setError(err?.message || 'Lỗi đăng nhập.')
        }
      }
    })
  }
  const tLogin = useTranslations('LoginPage');
  const tForm = useTranslations('Form');
  return (
    <Form
      className="flex w-96 flex-col gap-4"
      render={(props) => <form {...props} data-custom="foo" />}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">{tLogin('title')}</h1>
        <p className="text-sm text-balance text-muted-foreground">
          {tLogin('subTitle')}
        </p>
      </div>
      <TextField
        name="email"
        type="email"
        isDisabled={isPending}
        validate={(value) => {
          const result = emailSchema.safeParse(value);
          if (!result.success) {
            const message = JSON.parse(result.error.message);
            return message[0].message;
          }
          return null;
        }}
      >
        <Label>{tForm('email')}</Label>
        <Input placeholder={tForm('emailPh')} />
        <FieldError />
      </TextField>
      <TextField
        name="password"
        type="password"
        isDisabled={isPending}
        validate={(value) => {
          const result = passwordSchema.safeParse(value);
          if (!result.success) {
            return tForm('passwordDesc')
          }
          return null;
        }}
      >
        <Label>{tForm('password')}</Label>
        <Input placeholder={tForm('passwordPh')} />
        <FieldError />
      </TextField>
      <ErrorMessage>{error}</ErrorMessage>
      <div className="flex gap-2">
        <Button type="submit" className="w-full" isDisabled={isPending}>
          {tForm('loginBtn')}
        </Button>
      </div>
    </Form>
  )
}