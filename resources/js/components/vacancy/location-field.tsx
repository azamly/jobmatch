// "use client";
//
// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
//
// interface Props {
//     value: string;
//     onChange: (val: string) => void;
// }
//
// const popularCities = [
//     'Удалённо',
//     "Душанбе",
//     "Худжанд",
//     "Бохтар",
//     "Куляб",
//     "Истаравшан",
//     "Бустон",
//     "Турсунзаде",
//     "Хорог",
//     "Исфара",
//     "Конибодом",
//     "Пенджикент",
//     "Вахдат",
//     "Рогун",
//     "Нурек",
//     "Фархор",
//     "Дангара",
//     "Курган-Тюбе",
//     "Гиссар",
//     "Восе",
//     "Шахритус",
// ];
//
// export default function LocationField({ value, onChange }: Props) {
//     const [customCity, setCustomCity] = useState(
//         popularCities.includes(value) ? "" : value
//     );
//
//     return (
//         <div>
//             <Label>
//                 Местоположение <span className="text-red-500">*</span>
//             </Label>
//             <Select
//                 value={popularCities.includes(value) ? value : "other"}
//                 onValueChange={(val) => {
//                     if (val === "other") {
//                         onChange(customCity);
//                     } else {
//                         onChange(val);
//                         setCustomCity("");
//                     }
//                 }}
//             >
//                 <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Выберите город" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     {popularCities.map((city) => (
//                         <SelectItem key={city} value={city}>
//                             {city}
//                         </SelectItem>
//                     ))}
//                     <SelectItem value="other">Другое</SelectItem>
//                 </SelectContent>
//             </Select>
//
//             {(!popularCities.includes(value) || value === "other") && (
//                 <div className="mt-2">
//                     <Input
//                         placeholder="Введите свой город"
//                         value={customCity}
//                         onChange={(e) => {
//                             setCustomCity(e.target.value);
//                             onChange(e.target.value);
//                         }}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// }

import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    value: string;
    onChange: (val: string) => void;
}

const popularCities = [
    "Душанбе",
    "Худжанд",
    "Бохтар",
    "Куляб",
    "Истаравшан",
    "Бустон",
    "Турсунзаде",
    "Хорог",
    "Исфара",
    "Конибодом",
    "Пенджикент",
    "Вахдат",
    "Рогун",
    "Нурек",
    "Фархор",
    "Дангара",
    "Курган-Тюбе",
    "Гиссар",
    "Восе",
    "Шахритус",
];

export default function LocationField({ value, onChange }: Props) {
    return (
        <div>
            <Label>
                Местоположение <span className="text-red-500">*</span>
            </Label>
            <Select
                value={value && popularCities.includes(value) ? value : ""}
                onValueChange={onChange}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите город" />
                </SelectTrigger>
                <SelectContent>
                    {popularCities.map((city) => (
                        <SelectItem key={city} value={city}>
                            {city}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
