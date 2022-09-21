//    {"name": "", "atk": 0, "def": 0, "class": "","habs": []}
    //{"name": "Assassino Profissional", "atk": 2, "def": 7, "class": "L","habs": ["Habilidade: Se um alvo sofrer dano de Assassino Profissional ele ficará envenenado", "* Quando o personagem esta envenenado ele recebe 1 de dano "]}
var cards = [
    {"name": "Espadachim Novata", atk: 2, def: 12, "class": "C","habs": ["Passiva: Se equipado com espada ganha +1 de ataque", "Passiva: Se tiver mais um cavaleiro no grupo ganha +1 de ataque"]},
    {"name": "Cavaleiro Sanguinário", atk: 3, def: 10, "class": "C", "habs": ["Habilidade: Esta habilidade causa sangramento", "*Sangramento: Se o personagem for virado ele receberá 1 de dano"]},
    {"name": "Reinald O Quadrado", atk: 2, def: 14, "class": "C", "habs": ["Habilidade: Pode optar por levar o dano no lugar de outro membro do grupo (Reinald O Quadrado é virado"]},
    {"name": "Espadachim Alcoólatra", atk: 3, def: 8, "class": "L", "habs": ["Passiva: Se equipado com espada ganha +1 de ataque", "Passiva: Se usar um item a base de álcool regenera 1 de vida"]},
    {"name": "Cavaleiro da Milicia", atk: 4, def: 12, "class": "S", "habs": []},
    {"name": "James Violeiro", atk: 1, def: 8, "class": "M", "habs": ["Passiva: Enquanto estiver virado, os membros do grupo recebem +1 de ataque", "Habilidade: Pode desvirar outro personagem adicionando +1 de ataque até ser virada novamente"]},
    {"name": "Mercante Gastão", atk: 1, def: 10, "class": "NA", "habs": ["Habilidade: Ataca um personagem se o personagem receber o dano aumente em 1 o contador de moeda ( se o contador não existir, crie um iniciando do 1 e não o incremente)", "Habilidade: Pelo valor de 5 moedas procure no seu deck por um artefato e coloque na sua mão"]},
    {"name": "Ladrão Estabanado", atk: 2, def: 8, "class": "L", "habs": ["Habilidade: Jogue uma moeda, se tiver sucesso você pode pegar um artefato no campo de batalha, caso falhe 'Ladrão Estabanado' recebe 1 de dano"]},
    {"name": "Sacerdote", "atk": 2, "def": 8, "class": "S","habs": ["Habilidade: Cura 2 de vida de um personagem", "Habilidade: Adiciona +1 de ataque a um personagem"]},
    {"name": "Soldado da Guarda", "atk": 2, "def": 11, "class": "C","habs": ["Passiva: Se Soldado da Guarda não estiver virado e sofrer dano, reduza 1 deste dano recebido"]},
    {"name": "Assassino Sorrateiro", "atk": 5, "def": 5, "class": "L","habs": ["Passiva: Assassssino Sorrateiro pode ser alvo de ataques e habilidades somente quando virado"]},
    {"name": "Sábio Conselheiro", "atk": 1, "def": 8, "class": "M","habs": ["Habilidade: Pode desvirar uma carta", "Habilidade: Chamuscar, o personagem alvo sofre 2 de dano, jogue uma moeda se obtiver sucesso, adicione mais 1 no dano", "Habilidade: Clarão, vire uma carta"]}
];