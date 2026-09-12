"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Pencil, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillsInputProps {
    skills: string[];
    onChange: (skills: string[]) => void;
}

export default function SkillsInput({ skills, onChange }: SkillsInputProps) {
    const [newSkill, setNewSkill] = useState("");
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");

    const addSkill = () => {
        if (newSkill.trim() !== "") {
            onChange([...skills, newSkill.trim()]);
            setNewSkill("");
        }
    };

    const updateSkill = (index: number) => {
        const updated = [...skills];
        updated[index] = editValue.trim();
        onChange(updated);
        setEditIndex(null);
        setEditValue("");
    };

    const removeSkill = (index: number) => {
        onChange(skills.filter((_, i) => i !== index));
    };

    return (
        <div>
            <Label>
                Навыки <span className="text-red-500">*</span>
            </Label>

            {/* Список навыков */}
            <div className="mt-2 flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
                        {editIndex === i ? (
                            <>
                                <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="h-6 w-auto text-sm" />
                                <Button type="button" size="sm" variant="ghost" onClick={() => updateSkill(i)}>
                                    <CheckCircle />
                                </Button>
                            </>
                        ) : (
                            <>
                                <span className="text-sm">{skill}</span>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setEditIndex(i);
                                        setEditValue(skill);
                                    }}
                                >
                                    <Pencil size={14} />
                                </Button>
                                <Button type="button" size="sm" variant="ghost" onClick={() => removeSkill(i)}>
                                    <Trash2 size={14} />
                                </Button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Добавление навыка */}
            <div className={cn('flex items-center gap-2', skills.length > 0 ? 'mt-3' : '')}>
                <Input placeholder="Введите навык" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="w-1/2" />
                <Button type="button" onClick={addSkill}>
                    <Plus size={16} className="mr-1" /> Добавить
                </Button>
            </div>
        </div>
    );
}
