export default function About() {
    return (
        <section className="p-4 md:py-8 px-14">
            <h1 className="text-3xl text-zinc-800 font-bold mb-4">Your Dream Home Awaits!</h1>
            <div className="w-full md:h-[700px]">
                <img src="/about.webp" alt="About Image" className="rounded-3xl" />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-start mt-12 gap-4">
                <div className="w-full md:w-[50%]">
                    <img src="/code.webp" alt="Programmer" className="rounded-3xl md:max-h-[2000px]" />
                </div>
                <div className="w-full md:w-[45%] flex flex-col items-center gap-1">
                    <div className="md:max-h-[100px] md:px-5">
                        <h2 className="text-zinc-600 text-xl font-semibold mb-2">A Personal Journey by Juan Hernandez</h2>
                        <p className="text-zinc-400 text-normal text-pretty">Hi, I’m Juan Hernandez. This project showcases my programming skills and serves as a part of my portfolio. Please note that it’s not a real estate platform for buying or renting. Enjoy your visit!
                        </p>
                    </div>
                    <div>
                        <img src="/teleworking.webp" alt="Teleworking" className="rounded-3xl object-cover md:max-h-[800px] mt-8"/>
                    </div>
                </div>
            </div>
        </section>
    )
}
