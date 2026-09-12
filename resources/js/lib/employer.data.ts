const vacancyType:Record<string, string> = {
    full:'Полная занятость',
    part:'Частичная',
    remote:'Удалённая',
    contract:'Контракт',
    internship:'Стажировка',
    temporary:'Временная'
}

export const getVacancyType = (type:string): string => {
    return vacancyType[type] || 'Полная занятость'
}

const applicationType:Record<string, string> = {
    applied:'Заявлено',
    rejected:'Отклонено',
    accepted:'Принято',
}
export const getApplicationStatus = (type:string): string => {
    return applicationType[type] || 'Заявлено'
}
