"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface DatePickerInputProps {
    label?: string
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    fromYear?:number
    toYear?:number
}

export function DatePickerInput({
                                    label,
                                    value,
                                    onChange,
                                    placeholder = "Выберите дату",
                                    disabled = false,
                                    fromYear,
                                    toYear
                                }: DatePickerInputProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex flex-col space-y-2">
            {label && <Label>{label}</Label>}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? format(new Date(value), "dd.MM.yyyy") : placeholder}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value ? new Date(value) : undefined}
                        captionLayout={'dropdown'}
                        fromYear={fromYear}
                        toYear={toYear}
                        onSelect={(date) => {
                            if (date) {
                                onChange(date.toISOString()) // сохраняем ISO строку
                            }
                            setOpen(false)
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
