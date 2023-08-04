class ElementosDaTela {
    constructor(){
        this.janela = document.querySelector("#janela")
        this.menu = document.querySelector('#menu')
    }

    elementoJanela(){
        return this.janela
    }

    elemetoMenu(){
        return this.menu
    }
}

class GerenteDeNucleos {
    constructor(){
        this.posX = 0
        this.posY = 0
        this.modelo = document.querySelector('#nucleo')
        this.janela = document.querySelector("#janela")
        this.colecaoDeNucleos = []
        this.idNucleos = 1
        this.elementoCalculo = null
    }

    incluirCalculo(elemento){
        this.elementoCalculo = elemento
    }

    informarQtdeNucleos(){
        let qtde = 0
        for(let i in this.colecaoDeNucleos){
            if(i){
                qtde++
            }
        }

        this.elementoCalculo.pegarQtdeNucleos(qtde)
    }

    pegarCoordenadas(x, y){
        this.posX = x
        this.posY = y
    }

    determinarPosicao(){
        let pos = []
        pos['x'] = this.posX - this.janela.getBoundingClientRect().x - 10
        pos['y'] = this.posY - this.janela.getBoundingClientRect().y - 10

        if(pos['x'] < 2){
            pos['x'] = 2
        }

        if(pos['y'] < 2){
            pos['y'] = 2
        }
        return pos
    }

    criarNucleo(){
        const nucleo = new Nucleo(this.idNucleos, this.determinarPosicao()['x'], this.determinarPosicao()['y'])
        this.colecaoDeNucleos[`n${this.idNucleos}`] = nucleo

        const novoNucleo = this.modelo.cloneNode(true)
        novoNucleo.classList.remove('ocultar')
        novoNucleo.style.left = `${this.determinarPosicao()['x']}px`
        novoNucleo.style.top = `${this.determinarPosicao()['y']}px`
        novoNucleo.textContent = `${this.idNucleos}`
        novoNucleo.id = `n${this.idNucleos}`

        this.idNucleos++
        this.janela.appendChild(novoNucleo)
    }
}

class Nucleo {
    constructor(id, x, y){
        this.id = id
        this.x = x
        this.y = y
        this.relacionamento = {}
    }

    incluirDistancia(chave, valor){
        this.relacionamento[chave] = valor
    }
}

class BotaoSelecionado {
    constructor(){
        this.selected = 'adicionar'
        this.menu = document.querySelector('#menu')
        this.menu.addEventListener('click', e => {
            if(e.target.id === 'calcular'){
                return
            }

            for(let i = 0; i < menu.children.length; i++){
                menu.children[i].classList.remove('botao-selecionado')
            }

            switch(e.target.id){
                case 'adicionar':
                case 'limpar':
                case 'conectar':
                case 'remover':
                    e.target.classList.add('botao-selecionado')
                    this.selecionado(e.target.id)
                    break
            }
        })
    }

    selecionado(valor){
        this.selected = valor
    }
}

class ConexaoEntreNucleos {
    constructor(){
        this.linha = document.querySelector('#linha')
        this.input = document.querySelector('#input')
        this.nucleoSelecionado = null
        this.listaDeNucleosSelecionados = []
        this.pos = []
        this.idInput = ''
        this.elementoInput = null
        this.observador = null
        this.distanciaEntreDoisNucleos = null
    }

    incluirObservador(observador){
        this.observador = observador
    }

    incluiObservadorInput(observador){
        this.distanciaEntreDoisNucleos = observador
    }

    notificarObservador(){
        this.observador.ativarInput(this.elementoInput)
    }

    selecionarNucleo(elemento){
        this.nucleoSelecionado = document.querySelector(`#${elemento}`)
    }

    incluirNucleo(){
        if(this.listaDeNucleosSelecionados.length >= 2){
            this.listaDeNucleosSelecionados[this.listaDeNucleosSelecionados.length - 1].classList.remove('nucleo-selecionado')
            this.listaDeNucleosSelecionados.pop()
        }
        this.listaDeNucleosSelecionados.push(this.nucleoSelecionado)

        if(this.listaDeNucleosSelecionados.length >= 2){
            this.pegarCoordenadasDosNucleos()
            this.criarLinha()
        }
    }

    excluirNucleos(){
        this.listaDeNucleosSelecionados = []
    }

    exibirNucleoSelecionado(){
        for(let i = 0; i < this.listaDeNucleosSelecionados.length; i++){
            this.listaDeNucleosSelecionados[i].classList.add('nucleo-selecionado')
        }
    
    }

    criarLinha(){
        let linhaEntreNucleo = this.linha.cloneNode(true)
        linhaEntreNucleo.classList.remove('ocultar')

        if(this.pos['x1'] <= this.pos['x2']){
            linhaEntreNucleo.style.left = `${this.pos['x1']}px`
        }
        else {
            linhaEntreNucleo.style.left = `${this.pos['x2']}px`
        }

        if(this.pos['y1'] <= this.pos['y2']){
            linhaEntreNucleo.style.top = `${this.pos['y1']}px`
        }
        else {
            linhaEntreNucleo.style.top = `${this.pos['y2']}px`
        }

        linhaEntreNucleo.style.width = Math.abs(this.pos['x1'] - this.pos['x2']) + 20
        linhaEntreNucleo.style.height = Math.abs(this.pos['y1'] - this.pos['y2']) + 20
        elementosDaTela.elementoJanela().appendChild(linhaEntreNucleo)

        linhaEntreNucleo.children[0].setAttribute('x1', `${this.pos['x1'] - linhaEntreNucleo.getBoundingClientRect().x + 10}`)
        linhaEntreNucleo.children[0].setAttribute('y1', `${this.pos['y1'] - linhaEntreNucleo.getBoundingClientRect().y + 46}`)
        linhaEntreNucleo.children[0].setAttribute('x2', `${this.pos['x2'] - linhaEntreNucleo.getBoundingClientRect().x + 10}`)
        linhaEntreNucleo.children[0].setAttribute('y2', `${this.pos['y2'] - linhaEntreNucleo.getBoundingClientRect().y + 46}`)

        for(let i = 0; i < this.listaDeNucleosSelecionados.length; i++){
            this.listaDeNucleosSelecionados[i].classList.remove('nucleo-selecionado')
            this.nomearInput(this.listaDeNucleosSelecionados[i].id)
        }

        this.criarInput()
        this.distanciaEntreDoisNucleos.pegarNucleosInterligados( this.listaDeNucleosSelecionados[0],  this.listaDeNucleosSelecionados[1])
        this.excluirNucleos()
    }

    pegarCoordenadasDosNucleos(){
        this.pos['x1'] = gerenteDeNucleos.colecaoDeNucleos[this.listaDeNucleosSelecionados[0].id].x
        this.pos['y1'] = gerenteDeNucleos.colecaoDeNucleos[this.listaDeNucleosSelecionados[0].id].y
        this.pos['x2'] = gerenteDeNucleos.colecaoDeNucleos[this.listaDeNucleosSelecionados[1].id].x
        this.pos['y2'] = gerenteDeNucleos.colecaoDeNucleos[this.listaDeNucleosSelecionados[1].id].y
    }

    pegarCentroDosNucleos(){
        let centro = []
        centro['x'] = ((this.pos['x1'] + 10) + (this.pos['x2'] + 10)) / 2
        centro['y'] = ((this.pos['y1'] + 10) + (this.pos['y2'] + 10)) / 2
        return centro
    }

    criarInput(){
        let novoInput = this.input.cloneNode(true)
        novoInput.setAttribute('id', this.idInput)
        novoInput.classList.remove('ocultar')
        novoInput.style.left = `${this.pegarCentroDosNucleos()['x'] - 15}px`
        novoInput.style.top = `${this.pegarCentroDosNucleos()['y'] - 10}px`
        elementosDaTela.elementoJanela().appendChild(novoInput)

        this.idInput = ''
    }

    nomearInput(nome){
        this.idInput += nome

        if(this.idInput.lastIndexOf('n') > 0){
            let primeiroId = this.idInput.slice(1, this.idInput.lastIndexOf('n'))
            let segundoId = this.idInput.slice(this.idInput.lastIndexOf('n') + 1)
            
            if(segundoId < primeiroId){
                this.idInput = `n${segundoId}n${primeiroId}`
            }
        }
    }

    pegarIdInput(elemento){
        this.elementoInput = document.querySelector(`#${elemento}`)
    }

    retornarInput(){
        return this.elementoInput
    }
}

class GerenteDeInputs {
    constructor(){
        this.inputAtivo = null
        this.inputEscutado = null
        this.nucleo = null
        this.valor = null
        this.nucleosInterligados = []
    }

    incluirNucleo(nucleo){
        this.nucleo = nucleo
    }

    ativarInput(input){
        this.inputAtivo = input
    }

    escutarInput(){
        this.inputEscutado = this.inputAtivo.addEventListener('blur', () => {
            this.valor = this.inputAtivo.value
            this.nucleo.colecaoDeNucleos[this.nucleosInterligados['nucleo1']].incluirDistancia(`${this.nucleosInterligados['nucleo1']}${this.nucleosInterligados['nucleo2']}`, this.valor)
            this.nucleo.colecaoDeNucleos[this.nucleosInterligados['nucleo2']].incluirDistancia(`${this.nucleosInterligados['nucleo2']}${this.nucleosInterligados['nucleo1']}`, this.valor)
        })
    }

    pegarNucleosInterligados(nucleo1, nucleo2){
        this.nucleosInterligados['nucleo1'] = nucleo1.id
        this.nucleosInterligados['nucleo2'] = nucleo2.id
    }
}

class Calculo {
    constructor(){
        this.qtdeDeNucleos = 0
    }

    pegarQtdeNucleos(valor){
        this.qtdeDeNucleos = valor
        console.log(this.qtdeDeNucleos)
    }
}

const elementosDaTela = new ElementosDaTela()
const gerenteDeNucleos = new GerenteDeNucleos()
const botaoSelecionado = new BotaoSelecionado()
const gerenteDeInputs = new GerenteDeInputs()
const conexao = new ConexaoEntreNucleos()
const calculo = new Calculo()

conexao.incluirObservador(gerenteDeInputs)
conexao.incluiObservadorInput(gerenteDeInputs)
gerenteDeInputs.incluirNucleo(gerenteDeNucleos)
gerenteDeNucleos.incluirCalculo(calculo)

elementosDaTela.elementoJanela().addEventListener('mouseup', event => {
    const mouseX = event.clientX
    const mouseY = event.clientY

    if(botaoSelecionado.selected === 'adicionar'){
        gerenteDeNucleos.pegarCoordenadas(mouseX, mouseY)
        gerenteDeNucleos.criarNucleo()
    }

    if(botaoSelecionado.selected === 'conectar'){
        if(event.target.id[0] === 'n' && event.target.tagName === 'DIV'){
            conexao.selecionarNucleo(event.target.id)
            conexao.incluirNucleo()
            conexao.exibirNucleoSelecionado()
        }

        if(document.activeElement.tagName === 'INPUT'){
            conexao.pegarIdInput(document.activeElement.id)
            conexao.notificarObservador()
            gerenteDeInputs.escutarInput()
        }
    }
})

elementosDaTela.elemetoMenu().addEventListener('mouseup', e => {
    botaoSelecionado.selecionado(e.target.id)
    if(e.target.id === 'calcular'){
        gerenteDeNucleos.informarQtdeNucleos()
        botaoSelecionado.selecionado('adicionar')
    }
})







        