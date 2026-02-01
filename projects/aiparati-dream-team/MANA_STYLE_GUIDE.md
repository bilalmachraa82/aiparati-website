# 🌳 Secret of Mana Style Guide

> Guia de estilo visual e sonoro inspirado em **Secret of Mana** (Seiken Densetsu 2, 1993)
> Para uso nos projectos AiParaTi Dream Team

---

## 1. 🎨 Visual Identity

### 1.1 Paleta de Cores Principal

Inspirada nos ambientes icónicos de Secret of Mana, com tons vibrantes da era 16-bit.

#### Cores Primárias (Mana Core)
| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **Mana Blue** | `#4A90D9` | 74, 144, 217 | Elementos mágicos, UI principal |
| **Forest Green** | `#2D5A27` | 45, 90, 39 | Vegetação, áreas naturais |
| **Sacred Gold** | `#E8C252` | 232, 194, 82 | Itens, destaque, recompensas |
| **Spirit White** | `#F4F4E8` | 244, 244, 232 | Texto, magia de luz |

#### Cores Secundárias (Elementos)
| Nome | Hex | RGB | Elemento |
|------|-----|-----|----------|
| **Salamando Red** | `#D94545` | 217, 69, 69 | Fogo 🔥 |
| **Undine Aqua** | `#45B5D9` | 69, 181, 217 | Água 💧 |
| **Gnome Brown** | `#8B6B4A` | 139, 107, 74 | Terra 🪨 |
| **Sylphid Cyan** | `#45D9C7` | 69, 217, 199 | Vento 🌀 |
| **Luna Purple** | `#9B59B6` | 155, 89, 182 | Lua 🌙 |
| **Lumina Yellow** | `#F5D742` | 245, 215, 66 | Luz ✨ |
| **Shade Violet** | `#5B2C6F` | 91, 44, 111 | Escuridão 🌑 |
| **Dryad Lime** | `#7FBF4A` | 127, 191, 74 | Natureza 🌿 |

#### Cores de Ambiente
| Ambiente | Primária | Secundária | Accent |
|----------|----------|------------|--------|
| Floresta | `#2D5A27` | `#3D7A37` | `#7FBF4A` |
| Vila | `#C4A574` | `#8B6B4A` | `#E8C252` |
| Dungeon | `#2C2C3C` | `#4A4A5C` | `#6B5A8C` |
| Templo | `#E8E8D8` | `#C4B090` | `#E8C252` |
| Snow | `#E8F0F4` | `#B8C8D4` | `#4A90D9` |
| Desert | `#E8C870` | `#C4A048` | `#D94545` |

#### Cores UI/HUD
| Elemento | Cor | Hex |
|----------|-----|-----|
| HP Bar Full | Verde | `#4AE84A` |
| HP Bar Medium | Amarelo | `#E8E84A` |
| HP Bar Low | Vermelho | `#E84A4A` |
| MP Bar | Azul | `#4A90D9` |
| XP Bar | Dourado | `#E8C252` |
| Menu Background | Azul escuro | `#1A2A4A` |
| Menu Border | Dourado | `#B8962C` |
| Text Primary | Branco | `#F4F4E8` |
| Text Disabled | Cinza | `#8C8C8C` |

---

### 1.2 Sprite Guidelines

#### Dimensões Standard (16-bit Style)
| Tipo | Tamanho | Grid |
|------|---------|------|
| **Personagem** | 24×32 px | 8px base |
| **NPC Small** | 16×16 px | 8px base |
| **NPC Large** | 24×32 px | 8px base |
| **Boss** | 64×64 px - 128×128 px | 16px base |
| **Item/Object** | 16×16 px | 8px base |
| **Tile** | 16×16 px | 16×16 |

#### Direcções (4-way)
```
     [Up/North]
         ↑
[Left] ← ● → [Right]
         ↓
    [Down/South]
```

- **Down (Sul):** Frame default, cara visível
- **Up (Norte):** Costas visíveis
- **Left (Oeste):** Perfil esquerdo (pode ser flip de Right)
- **Right (Este):** Perfil direito

#### Walk Cycle (4 frames por direcção)
```
Frame 1: Idle/Contact (pé esquerdo à frente)
Frame 2: Passing (pés juntos, corpo mais alto)
Frame 3: Contact (pé direito à frente)
Frame 4: Passing (pés juntos, corpo mais alto)
```

**Timing:** 150-200ms por frame (6-8 FPS para movimento)

#### Animation Guidelines
| Animação | Frames | Loop |
|----------|--------|------|
| Idle | 2-4 | Yes |
| Walk | 4 | Yes |
| Run | 4-6 | Yes |
| Attack | 4-6 | No |
| Cast Spell | 6-8 | No |
| Hurt | 2 | No |
| Death | 4-6 | No |
| Victory | 4-6 | Yes |

#### Estilo de Arte
- **Outlines:** 1px preto (`#000000`) ou cor escura do sprite
- **Dithering:** Usar para gradientes (2×2 pattern max)
- **Anti-aliasing:** Manual, limitado (2-3 cores de transição)
- **Sombra:** 1-2px offset, 50% opacidade ou cor escura
- **Paleta por sprite:** Max 15 cores + transparente (limitação SNES)

---

### 1.3 Tileset Rules

#### Estrutura de Tiles
```
Base Tiles (16×16):
┌────┬────┬────┬────┐
│Gras│Path│Watr│Wall│  ← Ground layer
├────┼────┼────┼────┤
│Tree│Bush│Rock│Hous│  ← Object layer
├────┼────┼────┼────┤
│Roof│Door│Wind│Sign│  ← Detail layer
└────┴────┴────┴────┘
```

#### Tilesets por Ambiente

**🌲 Forest (Gaia's Navel style)**
- Ground: Grass, dirt path, flowers, mushrooms
- Objects: Trees (3-4 tipos), bushes, rocks, logs
- Details: Vines, fallen leaves, water puddles
- Transitions: Grass↔dirt, grass↔water

**🏘️ Village (Potos style)**
- Ground: Cobblestone, grass, wooden floors
- Objects: Houses, shops, fences, wells
- Details: Signs, barrels, crates, flowers
- NPCs: Villagers, merchants, guards

**🏰 Dungeon (Witch's Castle style)**
- Ground: Stone floor, carpet, grates
- Objects: Pillars, torches, chests, doors
- Details: Chains, skulls, cracks, moss
- Hazards: Spikes, pits, magic barriers

**❄️ Snow (Ice Country style)**
- Ground: Snow, ice, frozen water
- Objects: Pine trees, ice formations, igloos
- Details: Snowflakes, icicles, frost patterns

**🏜️ Desert (Kakkara style)**
- Ground: Sand, sandstone, oasis water
- Objects: Cacti, palm trees, ruins
- Details: Bones, pottery, hieroglyphs

#### Regras de Conexão (Autotile)
```
Corners: ┌ ┐ └ ┘  (4 tiles)
Edges:   ─ │      (2 tiles)
Inner:   ╬         (1 tile)
Outer:   ○         (1 tile isolated)

Total por terrain: 47 tiles (full autotile) ou 16 (simplified)
```

---

### 1.4 UI/HUD Design

#### Layout Principal (320×240 base)
```
┌─────────────────────────────────────────────┐
│ ♥♥♥♥♥♥ HP  [████████░░] 80/100             │ ← Status Bar
│ ★★★★★★ MP  [██████░░░░] 60/100             │
├─────────────────────────────────────────────┤
│                                             │
│                                             │
│              GAME AREA                      │
│              (288×200)                      │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│ [A]Attack [B]Magic [X]Item [Y]Menu          │ ← Action Bar
└─────────────────────────────────────────────┘
```

#### Dialogue Box
```
┌─────────────────────────────────┐
│ ┌───┐                           │
│ │NPC│  "Bem-vindo à aldeia!     │
│ │   │   Cuidado com os monstros │
│ └───┘   na floresta..."         │
│                          [▼]    │
└─────────────────────────────────┘
```
- **Background:** `#1A2A4A` com 85% opacidade
- **Border:** 2px, `#B8962C` (dourado)
- **Portrait:** 48×48 px, canto esquerdo
- **Font:** Pixel art, 8×8 ou 16×16
- **Indicator:** Seta animada para "continuar"

#### Menu Design
```
╔═══════════════════════╗
║  ⚔️ EQUIPMENT         ║
╠═══════════════════════╣
║  → Sword of Mana      ║
║    Iron Helm          ║
║    Leather Armor      ║
║    Power Ring         ║
╠═══════════════════════╣
║  ATK: 42  DEF: 28     ║
║  INT: 15  AGI: 20     ║
╚═══════════════════════╝
```

#### Iconografia
| Categoria | Exemplos |
|-----------|----------|
| Armas | Espada, lança, arco, machado, luvas |
| Armadura | Helm, chest, boots, shield |
| Consumíveis | Poção (vermelho), ether (azul), antídoto (verde) |
| Key Items | Chave, mapa, pergaminho |
| Magic | Orbs dos 8 elementos |

---

## 2. 🎵 Audio Identity

### 2.1 OST Tracks Essenciais

Compositor original: **Hiroki Kikuta**

#### Ambientes e Exploração
| Track | Nome Original | Uso |
|-------|---------------|-----|
| **Main Theme** | "Fear of the Heavens" | Title screen, momentos épicos |
| **Village** | "Into the Thick of It" | Vilas pacíficas, NPCs |
| **Forest** | "Phantom and a Rose" | Florestas, natureza |
| **Dungeon** | "The Oracle" | Caves, dungeons escuros |
| **Temple** | "The Wind Never Ceases" | Locais sagrados |
| **Snow** | "A Curious Happening" | Áreas geladas |
| **Desert** | "Danger" | Deserto, tensão leve |
| **Night** | "What the Forest Taught Me" | Cenas nocturnas |

#### Combate
| Track | Nome Original | Uso |
|-------|---------------|-----|
| **Battle Normal** | "Danger" | Encontros regulares |
| **Battle Boss** | "Meridian Dance" | Boss fights |
| **Battle Final** | "The Second Truth from the Left" | Boss finais |
| **Victory** | "Did You See the Ocean?" | Pós-combate |

#### Momentos Especiais
| Track | Nome Original | Uso |
|-------|---------------|-----|
| **Sad/Emotional** | "A Wish" | Momentos tristes |
| **Mystery** | "Spirit of the Night" | Revelações |
| **Peaceful** | "Color of the Summer Sky" | Descanso, save points |
| **Mana Tree** | "The Second Truth from the Left" | Momentos transcendentes |

### 2.2 Quando Usar Cada Track

```
GAMEPLAY LOOP:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Village   │ ──→ │   Explore   │ ──→ │   Dungeon   │
│  (Peaceful) │     │  (Ambient)  │     │  (Tense)    │
└─────────────┘     └─────────────┘     └─────────────┘
      ↑                   │                   │
      │                   ▼                   ▼
      │            ┌─────────────┐     ┌─────────────┐
      └─────────── │   Victory   │ ←── │   Combat    │
                   │  (Triumph)  │     │  (Action)   │
                   └─────────────┘     └─────────────┘
```

#### Regras de Transição
- **Fade out:** 500ms antes de mudar
- **Fade in:** 300ms no novo track
- **Combat:** Interrompe imediatamente, guarda posição do track anterior
- **Victory:** 3-5 segundos, depois retoma track anterior
- **Cutscene:** Override total até terminar

### 2.3 SFX Necessários

#### Movimento
| SFX | Descrição | Trigger |
|-----|-----------|---------|
| `step_grass` | Passos em relva | Walking on grass tiles |
| `step_stone` | Passos em pedra | Walking on stone/dungeon |
| `step_wood` | Passos em madeira | Walking on wooden floors |
| `step_water` | Splash leve | Walking in shallow water |
| `step_snow` | Crunch neve | Walking on snow |

#### Combate
| SFX | Descrição | Trigger |
|-----|-----------|---------|
| `sword_swing` | Whoosh metálico | Melee attack |
| `sword_hit` | Impact + grunt | Damage dealt |
| `bow_release` | Corda + arrow | Ranged attack |
| `arrow_hit` | Thunk | Projectile impact |
| `enemy_hurt` | Grunt genérico | Enemy takes damage |
| `enemy_death` | Poof + sparkle | Enemy defeated |
| `player_hurt` | Ouch | Player takes damage |
| `critical_hit` | Enhanced impact | Critical damage |
| `miss` | Whoosh curto | Attack missed |
| `block` | Clank metálico | Shield block |

#### Magia
| SFX | Descrição | Elemento |
|-----|-----------|----------|
| `magic_fire` | Whoosh + crackle | 🔥 Fogo |
| `magic_water` | Splash + bubble | 💧 Água |
| `magic_earth` | Rumble + crack | 🪨 Terra |
| `magic_wind` | Whoosh + whistle | 🌀 Vento |
| `magic_light` | Shimmer + chime | ✨ Luz |
| `magic_dark` | Low rumble + whisper | 🌑 Escuridão |
| `magic_heal` | Chime + sparkle | 💚 Cura |
| `magic_buff` | Rising tone | ⬆️ Buff |
| `magic_charge` | Building energy | Casting |
| `magic_release` | Burst | Spell complete |

#### UI/Feedback
| SFX | Descrição | Trigger |
|-----|-----------|---------|
| `menu_open` | Whoosh suave | Open menu |
| `menu_close` | Whoosh reverso | Close menu |
| `cursor_move` | Blip curto | Navigate menu |
| `confirm` | Ding positivo | Select option |
| `cancel` | Boop baixo | Cancel/back |
| `error` | Buzz curto | Invalid action |
| `item_pickup` | Sparkle + ding | Collect item |
| `item_use` | Pop + effect | Use consumable |
| `level_up` | Fanfare curta | Level up |
| `save` | Chime reconfortante | Game saved |
| `chest_open` | Creak + sparkle | Open chest |
| `door_open` | Creak madeira/pedra | Open door |
| `secret` | Mysterious chime | Secret found |

---

## 3. 📦 Asset Sources

### 3.1 Mana Seed (Seliel the Shaper) ⭐ RECOMENDADO

**O pack mais fiel ao estilo Secret of Mana!**

| Pack | Link | Preço | Conteúdo |
|------|------|-------|----------|
| **Character Base** | [itch.io/mana-seed-character-base](https://seliel-the-shaper.itch.io/character-base) | ~$15 | Base sprites, 4 dirs, animations |
| **Character Addon** | [itch.io/mana-seed-character-addon](https://seliel-the-shaper.itch.io/) | ~$10 | Extra outfits, hair, accessories |
| **Tilesets Bundle** | [itch.io/mana-seed-tilesets](https://seliel-the-shaper.itch.io/) | ~$20-40 | Forest, village, dungeon sets |
| **UI Pack** | [itch.io/mana-seed-ui](https://seliel-the-shaper.itch.io/) | ~$10 | Menus, HUD, icons |

**Vantagens:**
- ✅ Estilo idêntico a Secret of Mana
- ✅ Modular (mix & match)
- ✅ Updates frequentes
- ✅ Licença comercial
- ✅ Comunidade activa

### 3.2 Free 16-bit Assets Compatíveis

#### Sprites & Characters
| Nome | Link | Licença | Notas |
|------|------|---------|-------|
| Liberated Pixel Cup | [opengameart.org/lpc](https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets) | CC-BY/GPL | Grande variedade, estilo compatível |
| Time Fantasy | [timefantasy.net](https://timefantasy.net/) | Commercial | Estilo SNES, pago mas quality |
| Kenney RPG Pack | [kenney.nl/assets](https://kenney.nl/assets?q=rpg) | CC0 | Gratuito, estilo mais simples |
| Pixel Frog | [itch.io/pixel-frog](https://pixelfrog-assets.itch.io/) | Free | Characters e enemies |

#### Tilesets
| Nome | Link | Tipo |
|------|------|------|
| RPG Nature Tileset | [itch.io](https://cupnooble.itch.io/sprout-lands-asset-pack) | Forests, nature |
| Medieval Town | [opengameart.org](https://opengameart.org/content/lpc-medieval-village-tileset) | Villages |
| Dungeon Tileset | [itch.io](https://0x72.itch.io/dungeontileset-ii) | Caves, dungeons |

#### Icons & UI
| Nome | Link | Quantidade |
|------|------|------------|
| Game Icons | [game-icons.net](https://game-icons.net/) | 4000+ icons |
| RPG Icon Pack | [opengameart.org](https://opengameart.org/content/496-pixel-art-icons-for-medievalfantasy-rpg) | 496 icons |
| 16-bit UI Pack | [kenney.nl](https://kenney.nl/assets/game-icons) | Buttons, frames |

### 3.3 Music Resources

#### Royalty-Free 16-bit Style
| Nome | Link | Estilo | Licença |
|------|------|--------|---------|
| **OpenGameArt Music** | [opengameart.org/music](https://opengameart.org/art-search-advanced?field_art_type_tid%5B%5D=12) | Variado | CC/GPL |
| **Incompetech** | [incompetech.com](https://incompetech.com/music/) | Orquestral | CC-BY |
| **Free Music Archive** | [freemusicarchive.org](https://freemusicarchive.org/) | Variado | Variado |
| **8-bit Music (HeatleyBros)** | [YouTube](https://www.youtube.com/c/HeatleyBros) | Chiptune | Free w/ credit |

#### Composers for Hire (Estilo Mana)
| Artista | Estilo | Contacto |
|---------|--------|----------|
| Matthew Pablo | JRPG, Orchestral | [matthewpablo.com](https://matthewpablo.com/) |
| Yuki Nagasawa | 16-bit, Mana-like | Fiverr |
| Various | Chiptune | [itch.io/soundtracks](https://itch.io/soundtracks) |

#### SFX Libraries
| Nome | Link | Notas |
|------|------|-------|
| **Freesound** | [freesound.org](https://freesound.org/) | Gratuito, vários |
| **Kenney Audio** | [kenney.nl/assets](https://kenney.nl/assets?q=audio) | CC0, optimizado |
| **Gamedev Market** | [gamedevmarket.net](https://www.gamedevmarket.net/category/audio/) | Pago, pro quality |
| **SFXR/Bfxr** | [bfxr.net](https://www.bfxr.net/) | Gerar próprios SFX |
| **ChipTone** | [sfbgames.itch.io/chiptone](https://sfbgames.itch.io/chiptone) | Gerar 8/16-bit SFX |

---

## 4. 📋 Quick Reference

### Checklist Visual
- [ ] Sprites em 24×32 (characters) ou 16×16 (items)
- [ ] Máximo 15 cores por sprite
- [ ] 4 direcções de movimento
- [ ] Walk cycle de 4 frames
- [ ] Outlines de 1px
- [ ] Tiles em 16×16

### Checklist Audio
- [ ] Música ambiente por zona
- [ ] Track de batalha separado
- [ ] Victory jingle
- [ ] SFX de passos por terreno
- [ ] SFX de combate completo
- [ ] Feedback UI sonoro

### Paleta Rápida (Copy-Paste)
```css
:root {
  /* Core */
  --mana-blue: #4A90D9;
  --forest-green: #2D5A27;
  --sacred-gold: #E8C252;
  --spirit-white: #F4F4E8;
  
  /* Elements */
  --fire: #D94545;
  --water: #45B5D9;
  --earth: #8B6B4A;
  --wind: #45D9C7;
  --moon: #9B59B6;
  --light: #F5D742;
  --dark: #5B2C6F;
  --nature: #7FBF4A;
  
  /* UI */
  --hp-full: #4AE84A;
  --hp-mid: #E8E84A;
  --hp-low: #E84A4A;
  --mp: #4A90D9;
  --menu-bg: #1A2A4A;
  --menu-border: #B8962C;
}
```

---

## 5. 🔗 Links Úteis

- [Secret of Mana Wiki](https://mana.fandom.com/wiki/Secret_of_Mana)
- [Spriters Resource - SoM](https://www.spriters-resource.com/snes/secretofmana/)
- [VGMusic - SoM MIDI](https://www.vgmusic.com/music/console/nintendo/snes/index-sz.html)
- [Hiroki Kikuta Official](https://www.procyon-studio.co.jp/)
- [Lospec Palette List](https://lospec.com/palette-list)

---

*NOVA - Frontend Specialist*  
*Dream Team @ AiParaTi*  
*Criado: 2025-07-02*
