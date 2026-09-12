import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    Briefcase,
    Search,
    Shield,
    Zap,
    Globe,
    Star,
    ArrowRight,
    Play,
    Target,
    Sparkles,
    Menu, X, LogOut, LayoutGrid, Check
} from 'lucide-react';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';

const featuredJobs = [
    {
        id: 1,
        title: "Senior React Developer",
        company: "TechCorp",
        location: "Remote",
        salary: "150,000 - 250,000 ₽",
        type: "Full-time",
        skills: ["React", "TypeScript", "Node.js"],
        logo: "🚀",
        featured: true,
    },
    {
        id: 2,
        title: "UX/UI Designer",
        company: "DesignStudio",
        location: "Moscow",
        salary: "120,000 - 180,000 ₽",
        type: "Full-time",
        skills: ["Figma", "Adobe XD", "Prototyping"],
        logo: "🎨",
        featured: true,
    },
    {
        id: 3,
        title: "Product Manager",
        company: "StartupXYZ",
        location: "St. Petersburg",
        salary: "200,000 - 300,000 ₽",
        type: "Full-time",
        skills: ["Strategy", "Analytics", "Leadership"],
        logo: "📊",
        featured: true,
    },
]

const testimonials = [
    {
        name: "Анна Петрова",
        role: "Frontend Developer",
        company: "TechCorp",
        content:
            "Благодаря Портфолио я нашла работу мечты всего за 2 недели! Платформа действительно подбирает релевантные вакансии.",
        avatar: "👩‍💻",
        rating: 5,
    },
    {
        name: "Михаил Сидоров",
        role: "HR Director",
        company: "InnovateLab",
        content: "Мы закрыли 15 вакансий за месяц. Качество кандидатов превзошло все ожидания!",
        avatar: "👨‍💼",
        rating: 5,
    },
    {
        name: "Елена Козлова",
        role: "UX Designer",
        company: "CreativeAgency",
        content: "Интуитивный интерфейс и умные рекомендации. Лучшая платформа для поиска работы!",
        avatar: "👩‍🎨",
        rating: 5,
    },
]
const roundToNearestTen = (value: number): number => {
    return Math.round(value / 10) * 10;
};

export default function Welcome({users,employers}:{users:number,employers:number}) {
    const { auth } = usePage<SharedData>().props;
    const [currentTestimonial, setCurrentTestimonial] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const cleanup = useMobileNavigation();
    const stats = [
        { number: `${roundToNearestTen(users)}+`, label: 'Активных пользователей', icon: Users },
        { number: `${roundToNearestTen(employers)}+`, label: 'Компаний-партнеров', icon: Briefcase },
        { number: '85%', label: 'Успешных совпадений', icon: Target },
        { number: '24/7', label: 'Поддержка', icon: Shield },
        ]
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };
    useEffect(() => {
        setIsVisible(true)
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])
    const [isMenuOpen, setIsMenuOpen] = useState(false)


    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-background overflow-hidden">
                <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <Link href="/" className="flex items-center space-x-2">
                                <Briefcase className="h-8 w-8 text-primary" />
                                <span className="text-2xl font-bold">Jobmatch</span>
                            </Link>


                            {/* Desktop Actions */}
                            <div className="hidden md:flex items-center space-x-4">
                                <AppearanceToggleTab />
                                {auth.user ? (
                                    <>
                                        <Button variant={'outline'}>
                                            <Link href={route('dashboard')}>Панель управления</Link>
                                        </Button>
                                        <Button variant="ghost">
                                            <Link className="block text-red-500 w-full" method="post"
                                                  href={route('logout')} as="button" onClick={handleLogout}>
                                                Выйти
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button asChild variant="ghost">
                                            <Link href={route('login')}>Вход</Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href={route('register')}>Регистрация</Link>
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="md:hidden flex items-center space-x-2">
                                <AppearanceToggleTab />
                                <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        {isMenuOpen && (
                            <div className="md:hidden py-4 border-t">
                                <nav className="flex flex-col space-y-4">

                                    <div className="flex flex-col space-y-2 pt-4 border-t">
                                        {auth.user ? (
                                            <>
                                                <Button variant={'outline'} className='justify-start'>
                                                    <Link href={route('dashboard')}> Панель управление</Link>
                                                </Button>
                                                <Button variant="ghost">
                                                    <Link className="block text-red-500 w-full justify-start"
                                                          method="post" href={route('logout')} as="button"
                                                          onClick={handleLogout}>
                                                        Выйти
                                                    </Link>
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button asChild variant="ghost" className="justify-start">
                                                    <Link href="/login">Вход</Link>
                                                </Button>
                                                <Button asChild className="justify-start">
                                                    <Link href="/register">Регистрация</Link>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </nav>
                            </div>
                        )}
                    </div>
                </header>


                <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    {/* Animated Background */}
                    <div
                        className={`absolute inset-0 bg-[url('/ser.jpg')] blur-md bg-cover bg-center bg-no-repeat`}>
                        {/* Затемняющий слой для улучшения читаемости */}
                        <div className="absolute inset-0 bg-black/30"></div>
                        {/* SVG Pattern (опционально) */}
                        <div
                            className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg fill%3D%22none%22 fillRule%3D%22evenodd%22%3E%3Cg fill%3D%22%239C92AC%22 fillOpacity%3D%220.1%22%3E%3Ccircle cx%3D%2230%22 cy%3D%2230%22 r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"
                        ></div>
                    </div>

                    {/* Floating Elements */}
                    <div
                        className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
                    <div
                        className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
                    <div
                        className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>

                    <div
                        className={`max-w-7xl mx-auto text-center relative z-10 transition-all duration-1000 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                    >
                        <div
                            className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-white text-sm font-medium mb-6 animate-bounce"
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Новая эра поиска работы
                        </div>

                        <h1 className="text-4xl sm:text-7xl font-bold text-white mb-6 leading-tight">
                            Найдите работу
                            <span
                                className="text-primary block"
                            >
        мечты за минуты
      </span>
                        </h1>

                        <p className="text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
                            ИИ-платформа нового поколения для идеального совпадения между талантами и возможностями.
                            Более 100 успешных трудоустройств за последний месяц
                        </p>

                        {/* Interactive Search Bar */}
                        {/*<div className="max-w-2xl mx-auto mb-12">*/}
                        {/*    <div className="relative group">*/}
                        {/*        <div*/}
                        {/*            className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"*/}
                        {/*        ></div>*/}
                        {/*        <div*/}
                        {/*            className="relative bg-background border-2 border-primary/20 rounded-2xl p-2 flex items-center gap-2"*/}
                        {/*        >*/}
                        {/*            <div className="flex-1 flex items-center gap-2 px-4">*/}
                        {/*                <Search className="h-5 w-5 text-muted-foreground" />*/}
                        {/*                <Input*/}
                        {/*                    placeholder="Введите должность, навык или компанию..."*/}
                        {/*                    value={searchQuery}*/}
                        {/*                    onChange={(e) => setSearchQuery(e.target.value)}*/}
                        {/*                    className="border-0 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0"*/}
                        {/*                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}*/}
                        {/*                />*/}
                        {/*            </div>*/}
                        {/*            <Button size="lg" onClick={handleSearch} className="rounded-xl px-8">*/}
                        {/*                Найти работу*/}
                        {/*                <ArrowRight className="h-4 w-4 ml-2" />*/}
                        {/*            </Button>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/* Role Selection Cards */}
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                            <Card
                                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 bg-gradient-to-br from-background to-primary/5"
                            >
                                <CardContent className="p-8 text-center">
                                    <div
                                        className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                                    >
                                        <Users className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl text-white font-bold mb-2">Я ищу работу</h3>
                                    <p className="text-white mb-6">Найдите идеальную позицию с помощью
                                        ИИ-подбора</p>
                                    <Button asChild size="lg" className="w-full hover:bg-primary/80">
                                        <Link href="/register?role=worker">
                                            Начать поиск
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card
                                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-500/50 bg-gradient-to-br from-background to-purple-500/5"
                            >
                                <CardContent className="p-8 text-center">
                                    <div
                                        className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                                    >
                                        <Briefcase className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl text-white font-bold mb-2">Я ищу сотрудников</h3>
                                    <p className="text-white mb-6">Найдите лучших кандидатов для вашей
                                        работ и проектов</p>
                                    <Button
                                        asChild
                                        size="lg"
                                        className="w-full bg-purple-500 hover:bg-purple-500/80"
                                    >
                                        <Link href="/register?role=employer">
                                            Найти таланты
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <div
                                        className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform"
                                    >
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                                    <div className="text-sm text-white">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* Featured Jobs Section */}
                {/*<section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">*/}
                {/*    <div className="max-w-7xl mx-auto">*/}
                {/*        <div className="text-center mb-12">*/}
                {/*            <h2 className="text-3xl font-bold mb-4">🔥 Горячие вакансии</h2>*/}
                {/*            <p className="text-muted-foreground text-lg">Эксклюзивные предложения от топовых*/}
                {/*                компаний</p>*/}
                {/*        </div>*/}

                {/*        <div className="grid md:grid-cols-3 gap-6">*/}
                {/*            {featuredJobs.map((job, index) => (*/}
                {/*                <Card*/}
                {/*                    key={job.id}*/}
                {/*                    className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${index === 1 ? "md:scale-105 border-primary/50" : ""}`}*/}
                {/*                >*/}
                {/*                    <CardHeader>*/}
                {/*                        <div className="flex items-start justify-between">*/}
                {/*                            <div className="flex items-center gap-3">*/}
                {/*                                <div className="text-3xl">{job.logo}</div>*/}
                {/*                                <div>*/}
                {/*                                    <CardTitle*/}
                {/*                                        className="text-lg group-hover:text-primary transition-colors">*/}
                {/*                                        {job.title}*/}
                {/*                                    </CardTitle>*/}
                {/*                                    <CardDescription>{job.company}</CardDescription>*/}
                {/*                                </div>*/}
                {/*                            </div>*/}
                {/*                            {job.featured && (*/}
                {/*                                <Badge*/}
                {/*                                    className="bg-gradient-to-r from-primary to-purple-500 text-white">*/}
                {/*                                    <Star className="h-3 w-3 mr-1" />*/}
                {/*                                    Featured*/}
                {/*                                </Badge>*/}
                {/*                            )}*/}
                {/*                        </div>*/}
                {/*                    </CardHeader>*/}
                {/*                    <CardContent className="space-y-4">*/}
                {/*                        <div className="flex items-center justify-between text-sm">*/}
                {/*                            <span className="text-muted-foreground">{job.location}</span>*/}
                {/*                            <span className="font-semibold text-primary">{job.salary}</span>*/}
                {/*                        </div>*/}

                {/*                        <div className="flex flex-wrap gap-2">*/}
                {/*                            {job.skills.map((skill) => (*/}
                {/*                                <Badge key={skill} variant="secondary" className="text-xs">*/}
                {/*                                    {skill}*/}
                {/*                                </Badge>*/}
                {/*                            ))}*/}
                {/*                        </div>*/}

                {/*                        <Button className="w-full group-hover:bg-primary/90 transition-colors">*/}
                {/*                            Подробнее*/}
                {/*                            <ArrowRight*/}
                {/*                                className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />*/}
                {/*                        </Button>*/}
                {/*                    </CardContent>*/}
                {/*                </Card>*/}
                {/*            ))}*/}
                {/*        </div>*/}

                {/*        <div className="text-center mt-8">*/}
                {/*            <Button asChild variant="outline" size="lg">*/}
                {/*                <Link href="/jobs">*/}
                {/*                    Посмотреть все вакансии*/}
                {/*                    <ArrowRight className="h-4 w-4 ml-2" />*/}
                {/*                </Link>*/}
                {/*            </Button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</section>*/}

                {/* Features Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">Почему выбирают Портфолио?</h2>
                            <p className="text-xl text-muted-foreground">Технологии будущего для поиска работы
                                сегодня</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Zap,
                                    title: "ИИ-подбор",
                                    description:
                                        "Алгоритм машинного обучения анализирует ваши навыки и предпочтения для идеального совпадения",
                                    color: "text-yellow-500",
                                    bgColor: "bg-yellow-500/10",
                                },
                                {
                                    icon: Shield,
                                    title: "Проверенные компании",
                                    description: "Все работодатели проходят верификацию. Работайте только с надежными партнерами",
                                    color: "text-green-500",
                                    bgColor: "bg-green-500/10",
                                },
                                {
                                    icon: Globe,
                                    title: "Крутые возможности",
                                    description: "Доступ к вакансиям по всему Таджикистану. Выбирайте любую занятость под себя",
                                    color: "text-blue-500",
                                    bgColor: "bg-blue-500/10",
                                },
                            ].map((feature, index) => (
                                <Card
                                    key={index}
                                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-background to-muted/50"
                                >
                                    <CardContent className="p-8 text-center">
                                        <div
                                            className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}
                                        >
                                            <feature.icon className={`h-8 w-8 ${feature.color}`} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                {/*<section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-purple-500/5">*/}
                {/*    <div className="max-w-4xl mx-auto text-center">*/}
                {/*        <h2 className="text-3xl font-bold mb-12">Что говорят наши пользователи</h2>*/}

                {/*        <div className="relative">*/}
                {/*            <Card className="border-0 shadow-2xl bg-background/80 backdrop-blur">*/}
                {/*                <CardContent className="p-8">*/}
                {/*                    <div className="text-6xl mb-4">{testimonials[currentTestimonial].avatar}</div>*/}
                {/*                    <blockquote className="text-xl italic mb-6 leading-relaxed">*/}
                {/*                        "{testimonials[currentTestimonial].content}"*/}
                {/*                    </blockquote>*/}
                {/*                    <div className="flex justify-center mb-4">*/}
                {/*                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (*/}
                {/*                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />*/}
                {/*                        ))}*/}
                {/*                    </div>*/}
                {/*                    <div className="font-semibold text-lg">{testimonials[currentTestimonial].name}</div>*/}
                {/*                    <div className="text-muted-foreground">*/}
                {/*                        {testimonials[currentTestimonial].role} в {testimonials[currentTestimonial].company}*/}
                {/*                    </div>*/}
                {/*                </CardContent>*/}
                {/*            </Card>*/}

                {/*            /!* Testimonial indicators *!/*/}
                {/*            <div className="flex justify-center mt-6 gap-2">*/}
                {/*                {testimonials.map((_, index) => (*/}
                {/*                    <button*/}
                {/*                        key={index}*/}
                {/*                        onClick={() => setCurrentTestimonial(index)}*/}
                {/*                        className={`w-3 h-3 rounded-full transition-all ${*/}
                {/*                            index === currentTestimonial ? "bg-primary scale-125" : "bg-muted-foreground/30"*/}
                {/*                        }`}*/}
                {/*                    />*/}
                {/*                ))}*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</section>*/}

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-purple-500 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-6">Готовы изменить свою карьеру?</h2>
                        <p className="text-xl mb-8 opacity-90">
                            Присоединяйтесь к тысячам профессионалов, которые уже нашли работу мечты
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" variant="secondary"
                                    className="text-primary hover:scale-105 transition-transform">
                                <Link href="/register">
                                    Зарегистрироваться
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>

                        </div>
                    </div>
                </section>
                <footer className="bg-muted/50 border-t">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Logo and Description */}
                            <div className="col-span-1 md:col-span-2">
                                <Link href="/" className="flex items-center space-x-2 mb-4">
                                    <Briefcase className="h-8 w-8 text-primary" />
                                    <span className="text-2xl font-bold">Jobmatch</span>
                                </Link>
                                <p className="text-muted-foreground mb-4">
                                    Соединяем талантливых работников с инновационными работодателями. Развивайте карьеру
                                    или расширяйте
                                    команду с помощью нашей интеллектуальной платформы подбора.
                                </p>
                            </div>

                            {/*/!* Quick Links *!/*/}
                            {/*<div>*/}
                            {/*    <h3 className="font-semibold mb-4">Быстрые ссылки</h3>*/}
                            {/*    <ul className="space-y-2">*/}
                            {/*        <li>*/}
                            {/*            <Link href="/about"*/}
                            {/*                  className="text-muted-foreground hover:text-foreground transition-colors">*/}
                            {/*                О нас*/}
                            {/*            </Link>*/}
                            {/*        </li>*/}
                            {/*        <li>*/}
                            {/*            <Link href="/contact"*/}
                            {/*                  className="text-muted-foreground hover:text-foreground transition-colors">*/}
                            {/*                Контакты*/}
                            {/*            </Link>*/}
                            {/*        </li>*/}
                            {/*        <li>*/}
                            {/*            <Link href="/careers"*/}
                            {/*                  className="text-muted-foreground hover:text-foreground transition-colors">*/}
                            {/*                Карьера*/}
                            {/*            </Link>*/}
                            {/*        </li>*/}
                            {/*        <li>*/}
                            {/*            <Link href="/blog"*/}
                            {/*                  className="text-muted-foreground hover:text-foreground transition-colors">*/}
                            {/*                Блог*/}
                            {/*            </Link>*/}
                            {/*        </li>*/}
                            {/*    </ul>*/}
                            {/*</div>*/}

                            {/*/!* Legal *!/*/}
                            {/*<div>*/}
                            {/*    <h3 className="font-semibold mb-4">Правовая информация</h3>*/}
                            {/*    <ul className="space-y-2">*/}
                            {/*        <li>*/}
                            {/*            <Link href="/privacy"*/}
                            {/*                  className="text-muted-foreground hover:text-foreground transition-colors">*/}
                            {/*                Политика конфиденциальности*/}
                            {/*            </Link>*/}
                            {/*        </li>*/}
                            {/*        <li>*/}
                            {/*            <Link href="/terms"*/}
                            {/*                  className="text-muted-foreground hover:text-foreground transition-colors">*/}
                            {/*                Условия использования*/}
                            {/*            </Link>*/}
                            {/*        </li>*/}
                            {/*        <li>*/}
                            {/*            <Link href="/cookies"*/}
                            {/*                  className="text-muted-foreground hover:text-foreground transition-colors">*/}
                            {/*                Политика cookies*/}
                            {/*            </Link>*/}
                            {/*        </li>*/}
                            {/*    </ul>*/}
                            {/*</div>*/}
                        </div>

                        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
                            <p>&copy; {new Date().getFullYear()} Портфолио. Все права защищены.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
