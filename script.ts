interface Veiculo {
    nome: string,
    placa: string,
    entrada: Date | string;
}

(function () {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

function calTempo(mil: number):string {
    const min = Math.floor(mil /60000);
    const sec = Math.floor((mil % 60000) / 1000);

    return `${min}m e ${sec}s`
}

    function patio() {

        function ler(): Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];

        }

        function salvar(veiculos: Veiculo[]) {
            localStorage.setItem("patio", JSON.stringify(veiculos))
        }

        function adicionar(veiculo: Veiculo, salva?: boolean) {
            const row = document.createElement("tr");

            row.innerHTML =`
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class="delete" data-placa="${veiculo.placa}">X</button>
            </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function(this: any) {
                remover(this.dataset.placa);
            });

            $("#patio")?.appendChild(row);

            if(salva)salvar([...ler(), veiculo]);
        }

        function remover(placa: string) {


            
            const veiculo = ler().find(veiculo => veiculo.placa === placa);


            if (!veiculo) {
                throw new Error(`Veículo com placa ${placa} não encontrado.`);
            }
            
            const { entrada, nome } = veiculo;

            const tempo = calTempo(new Date().getTime() - new Date (entrada).getTime());

            if(!confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) return;
            salvar(ler().filter((veiculo) => veiculo.placa !== placa));
            render();
        }



        function render() {
            //! para indicar que nao sera null
            $("#patio")!.innerHTML = "";

            const patio = ler();

            if(patio.length){
                patio.forEach(veiculo => adicionar(veiculo));
                
            }
            
        }

        return { ler, adicionar, remover, salvar, render };
    }

patio().render();

    //"?"" porque o elemento "$" pode ver nulo na validacao acima
    $('#cadastrar')?.addEventListener('click', () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        console.log({ nome, placa })

        if (!nome || !placa) {
            alert("Os campos nome e placa são obrigatorios");
            return;
        }

        patio().adicionar({ nome, placa, entrada: new Date().toISOString()}, true);
    });

   

})();