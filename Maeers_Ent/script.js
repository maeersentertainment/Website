document.addEventListener('DOMContentLoaded', function () {
    console.log('Maeers Entertainment Loaded');

    // =====================================
    // DISCORD BUTTON
    // =====================================
    const joinBtn = document.querySelector('.join-btn');
    if (joinBtn) {
        joinBtn.addEventListener('click', function () {
            // Optional: you can add a toast/alert here if you want
            // alert('Redirecting to Discord...');
        });
    }

    // =====================================
    // STATS (FAKE NUMBERS / DEMO)
    // =====================================
    function updateStats() {
        const playerEl = document.getElementById('player-count');
        const businessEl = document.getElementById('business-count');

        if (playerEl) {
            playerEl.textContent = Math.floor(Math.random() * 100) + 50;
        }
        if (businessEl) {
            businessEl.textContent = Math.floor(Math.random() * 20) + 5;
        }
    }

    updateStats();
    setInterval(updateStats, 5000);

    // =====================================
    // GAMES DROPDOWN PREVIEW + CLICK
    // =====================================
    (function setupGameDropdown() {
        const gameItems = document.querySelectorAll('.game-item');
        const previewImg = document.getElementById('game-preview-img');

        if (!gameItems.length || !previewImg) return;

        gameItems.forEach(item => {
            // Change preview image on hover
            item.addEventListener('mouseenter', () => {
                const img = item.dataset.image;
                if (img) {
                    previewImg.src = img;
                    const titleEl = item.querySelector('.game-title');
                    if (titleEl) {
                        previewImg.alt = titleEl.textContent + ' preview';
                    }
                }
            });

            // Navigate on click
            item.addEventListener('click', () => {
                const link = item.dataset.link;
                if (link) {
                    window.location.href = link;
                }
            });
        });
    })();


    (function setupHeroSlider() {
        const slider = document.querySelector('.slider');
        if (!slider) return;

        const slides = Array.from(slider.querySelectorAll('.slide'));
        const prevBtn = slider.querySelector('.slider-arrow.prev');
        const nextBtn = slider.querySelector('.slider-arrow.next'); 
        const dotsContainer = slider.querySelector('.slider-dots');

        if (!slides.length || !dotsContainer) return;

        let currentIndex = slides.findIndex(s => s.classList.contains('active'));
        if (currentIndex === -1) currentIndex = 0;


        const dots = slides.map((_, idx) => {
            const dot = document.createElement('button');
            if (idx === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(idx));
            dotsContainer.appendChild(dot);
            return dot;
        });

        function updateSlides() {
            slides.forEach((slide, idx) => {
                if (idx === currentIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function goToSlide(index) {
            const total = slides.length;
            currentIndex = (index + total) % total;
            updateSlides();
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });
        }


        updateSlides();
    })();


    (function setupFaqDropdowns() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;

        faqItems.forEach(item => {
            const toggle = item.querySelector('.faq-toggle');
            if (!toggle) return;

            toggle.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                // Close all items (accordion behaviour)
                faqItems.forEach(i => i.classList.remove('open'));

                // Open this one if it was closed
                if (!isOpen) {
                    item.classList.add('open');
                }

                // Update icons (+ / −)
                faqItems.forEach(i => {
                    const icon = i.querySelector('.faq-icon');
                    if (icon) {
                        icon.textContent = i.classList.contains('open') ? '−' : '+';
                    }
                });
            });
        });
    })();

    // =====================================
    // WHAT'S NEW – HORIZONTAL IMAGE SCROLLER
    // =====================================
    (function setupWhatsNewCarousel() {
        const carousel = document.querySelector('.whats-carousel');
        if (!carousel) return;

        const track = carousel.querySelector('.whats-track');
        const prev = carousel.querySelector('.whats-arrow.whats-prev');
        const next = carousel.querySelector('.whats-arrow.whats-next');
        if (!track || !prev || !next) return;

        const items = track.querySelectorAll('.whats-item');
        if (!items.length) return;

        // How much to scroll each click (one card width + gap)
        function getScrollAmount() {
            const firstItem = items[0];
            if (!firstItem) return 300;

            const itemWidth = firstItem.getBoundingClientRect().width;
            // 18px is the approximate gap from CSS
            return itemWidth + 18;
        }

        function scrollByDirection(direction) {
            const amount = getScrollAmount();
            track.scrollBy({
                left: direction * amount,
                behavior: 'smooth',
            });
        }

        prev.addEventListener('click', () => {
            scrollByDirection(-1);
        });

        next.addEventListener('click', () => {
            scrollByDirection(1);
        });
    })();
});


    // =====================================
    // CARD DATABASE (SEARCH + RENDER)
    // =====================================
    (function setupCardDatabase() {
        const grid = document.getElementById('card-grid');
        const searchInput = document.getElementById('card-search');
        if (!grid || !searchInput) return; // not on database page

        const cards = [
            {
                name: "Arrietta, Hero of the Forest",
                image: "public_html/Arrietta_Hero_of_the_Forest.png",
                cost: 10,
                type: "Creature",
                text: "Impatient, Speed Strike, Grounded, Pinger II. Critical if your Speed is higher than your opponent's when attacking. Interrupt: Once per turn spend 1 Soul to deal 3 damage to your opponent's Hitpoints."
            },
            {
                name: "Azar, the Raging Flame",
                image: "Azar_the_Raging_Flame.png",
                cost: 6,
                type: "Creature",
                text: "Airborne, Pinger 3. Every creature on your opponent's field must make a Block roll against Azar when it attacks."
            },
            {
                name: "Az'kov's Cerberus",
                image: "Azkovs_Cerberus.png",
                cost: 5,
                type: "Creature",
                text: "Impatient, Pinger 2. After a successful attack, burn adjacent creatures. Burned creatures take 3 damage at the start of their controller's turn."
            },
            {
                name: "Az'kov's Seer",
                image: "AzKovs_Seer.png",
                cost: 2,
                type: "Creature",
                text: "Grounded, Aegis, Speed Strike. When summoned, look at your opponent's hand or graveyard and remove a card from the game."
            },
            {
                name: "Bats",
                image: "Bats.png",
                cost: 1,
                type: "Creature",
                text: "Airborne, Lifedrain I. Bats cannot be blocked by creatures with Patience."
            },
            {
                name: "Cockatrice",
                image: "Cockatrice.png",
                cost: 1,
                type: "Creature",
                text: "Interrupt: Sacrifice this creature to heal 3 Hitpoints."
            },
            {
                name: "Copycat",
                image: "Copycat.png",
                cost: 3,
                type: "Creature",
                text: "Impatient. When Copycat is summoned, it shapeshifts into another card on the field."
            },
            {
                name: "Eel Guardian",
                image: "Eel_Guardian.png",
                cost: 3,
                type: "Creature",
                text: "Speed Strike. On a successful attack, make another attack on a different creature."
            },
            {
                name: "Angel of Healing",
                image: "Angel_of_Healing.png",
                cost: 2,
                type: "Creature",
                text: "Airborne. At the start of your turn, heal your Hitpoints for each Angel on your side of the field."
            },
            {
                name: "Archangel of Justice",
                image: "Archangel_of_Justice.png",
                cost: 6,
                type: "Creature",
                text: "Airborne, Aegis. If an opponent's creature has 3 Hitpoints or less, remove it from play."
            },

            // ===== SECOND BATCH (NEW 10) =====
            {
                name: "King Crab",
                image: "King_Crab.png",
                cost: 4,
                type: "Creature",
                text: "Aegis. On a successful block, deal 6 damage to the attacking creature."
            },
            {
                name: "Kraken",
                image: "Kraken.png",
                cost: 6,
                type: "Creature",
                text: "Grounded. When summoned, fill all open slots on your field with Tentacle tokens. At the start of your turn, you may eat a Tentacle to gain 1 Soul."
            },
            {
                name: "Manticore",
                image: "Manticore.png",
                cost: 3,
                type: "Creature",
                text: "Airborne, Speed Strike. On a successful attack, paralyze your opponent's creature until the start of your next turn."
            },
            {
                name: "Faeries",
                image: "Faeries.png",
                cost: 2,
                type: "Creature",
                text: "Airborne. Small but evasive creatures that strike from above."
            },
            {
                name: "Goblin King",
                image: "Goblin_King.png",
                cost: 4,
                type: "Creature",
                text: "Soul Attractor 2. All Goblins on your side of the field gain +1 in all stats."
            },
            {
                name: "Grogath",
                image: "Grogath.png",
                cost: 3,
                type: "Creature",
                text: "Brutal frontline warrior that excels at close-quarters combat."
            },
            {
                name: "Gulpy",
                image: "Gulpy.png",
                cost: 5,
                type: "Creature",
                text: "Grounded, Aegis. At the start of your turn, you may Swallow an opponent's creature until the start of your next turn. You cannot swallow the same creature twice in a row."
            },
            {
                name: "Hobgoblin",
                image: "Hobgoblin.png",
                cost: 2,
                type: "Creature",
                text: "Impatient. If another Goblin is on the field, Hobgoblin gets +1 Strength."
            },
            {
                name: "Igneous Gargoyle",
                image: "Igneous_Gargoyle.png",
                cost: 1,
                type: "Creature",
                text: "Airborne. Igneous Gargoyle can attack your opponent's Hitpoints directly."
            },
            {
                name: "Imp",
                image: "Imp.png",
                cost: 1,
                type: "Creature",
                text: "At the start of your turn, put a Soul counter on Imp. Sacrifice Imp to gain Souls equal to the number of Soul counters on it."
            },
                        {
                name: "Squeek the Thief",
                image: "Squeek_the_Thief.png",
                cost: 1,
                type: "Creature",
                text: "Impatient. On a Successful Attack you may play a card from your Opponent’s Graveyard until the end of the turn."
            },
            {
                name: "Tinkerer's Apprentice",
                image: "Tinkerers_Apprentice.png",
                cost: 2,
                type: "Creature",
                text: "Pinger I, Aegis. Interrupt - Remove 3 Cards in your Graveyard from the game to gain 1 Soul."
            },
            {
                name: "Henry, Hero of Healing",
                image: "Henry_Hero_of_Healing.png",
                cost: 10,
                type: "Creature",
                text: "Soul Attractor III, Aegis. You may Heal 5 Hitpoints to any Creature at the start of your turn. Interrupt - Spend 1 Soul to Ressurect a Creature that died this turn with 1 Hitpoint."
            },
            {
                name: "Marisa, Mother of Arachnes",
                image: "Marisa_Mother_of_Arachnes.png",
                cost: 6,
                type: "Creature",
                text: "Impatient, Speed Strike, Grounded, Pinger 2. If there is an open Creature Slot on your Field, at the start of your turn, summon a Spider Hatchling Token."
            },
            {
                name: "Metamorphic Gargoyle",
                image: "Metamorphic_Gargoyle.png",
                cost: 1,
                type: "Creature",
                text: "Airbourne. Interrupt - Once per game, Metamorphic Gargoyle can turn into Stone, avoiding any Damage that is directed at it."
            },
            {
                name: "Phoenix",
                image: "Phoenix.png",
                cost: 2,
                type: "Creature",
                text: "Airbourne, Impatient. When the Phoenix dies, create a Baby Phoenix Token."
            },
            {
                name: "Pirate",
                image: "Pirate.png",
                cost: 1,
                type: "Creature",
                text: "Pinger I."
            },
            {
                name: "Pirate Captain",
                image: "Pirate_Captain.png",
                cost: 4,
                type: "Creature",
                text: "Pinger 3. When the Pirate Captain enters, create a Pirate Ship field spell. The Pirate Captain’s Strength is equal to the number of Pirates you have on your field."
            },
            {
                name: "Rat",
                image: "Rat.png",
                cost: 1,
                type: "Creature",
                text: "Impatient, Execute."
            },
            {
                name: "Rat King",
                image: "Rat_King.png",
                cost: 4,
                type: "Creature",
                text: "Impatient, Soul Extractor II, Execute. If you have 3 Rats on the field while this card is in your hand or deck you may sacrafice all three rats. If you do, you can summon this card for free."
            },

            {
                name: "Soul Shrine",
                image: "Soul_Shrine.png",
                cost: 2,
                type: "Field Spell",
                text: "At the start of your turn, gain 1 Soul."
            },











            {
    name: "Sigmund, Hero of Valor",
    image: "Sigmund_Hero_of_Valor.png",
    cost: 10,
    type: "Creature",
    text: "Impatient, Aegis. Anytime Sigmund, Hero of Valor gets damaged, increase his Strength by 1. Interrupt - Spend 1 Soul to decide which Creature blocks Sigmund, Hero of Valor."
},
{
    name: "Sirens",
    image: "Sirens.png",
    cost: 1,
    type: "Creature",
    text: "Provoke."
},
{
    name: "Sphinx",
    image: "Sphinx.png",
    cost: 3,
    type: "Creature",
    text: "Airbourne. At the start of your turn, look at the top card of your deck; you may put it on the bottom of your deck."
},
{
    name: "Trenok",
    image: "Trenok.png",
    cost: 2,
    type: "Creature",
    text: "Reduce the damage dealt to Trenok by 1."
},
{
    name: "Undead Pirate",
    image: "Undead_Pirate.png",
    cost: 1,
    type: "Creature",
    text: "Pinger 1. You may summon Undead Pirate from your Graveyard."
},
{
    name: "Yarnak",
    image: "Yarnak.png",
    cost: 3,
    type: "Creature",
    text: "Aegis. Yarnak must attack the last Creature that dealt combat damage to him."
},
{
    name: "Scalthyr",
    image: "Scalthyr.png",
    cost: 4,
    type: "Creature",
    text: "Grounded, Aegis. At the start of your turn, Scalthyr heals 3 Hit Points."
},
{
    name: "Sediment Gargoyle",
    image: "Sediment_Gargoyle.png",
    cost: 1,
    type: "Creature",
    text: "Airbourne. As long as Metamorphic, Igneous, and Sediment Gargoyles are all on the field, at the start of your turn you gain 2 Souls."
},


        ];

        function createCardElement(card) {
            const wrapper = document.createElement('article');
            wrapper.className = 'db-card';

            const img = document.createElement('img');
            img.src = card.image;
            img.alt = card.name;

            const body = document.createElement('div');
            body.className = 'db-card-body';

            const header = document.createElement('div');
            header.className = 'db-card-header';

            const title = document.createElement('h3');
            title.textContent = card.name;

            const cost = document.createElement('span');
            cost.className = 'db-cost-badge';
            cost.textContent = card.cost;

            header.appendChild(title);
            header.appendChild(cost);

            const type = document.createElement('p');
            type.className = 'db-type';
            type.textContent = card.type;

            const text = document.createElement('p');
            text.className = 'db-rules';
            text.textContent = card.text;

            body.appendChild(header);
            body.appendChild(type);
            body.appendChild(text);

            wrapper.appendChild(img);
            wrapper.appendChild(body);

            return wrapper;
        }

        function render(list) {
            grid.innerHTML = '';
            if (!list.length) {
                const empty = document.createElement('p');
                empty.className = 'db-empty';
                empty.textContent = 'No cards match your search yet.';
                grid.appendChild(empty);
                return;
            }

            list.forEach(card => {
                grid.appendChild(createCardElement(card));
            });
        }

        function filterCards() {
            const q = searchInput.value.trim().toLowerCase();
            if (!q) {
                render(cards);
                return;
            }
            const filtered = cards.filter(card => {
                return (
                    card.name.toLowerCase().includes(q) ||
                    String(card.cost).includes(q) ||
                    card.type.toLowerCase().includes(q) ||
                    card.text.toLowerCase().includes(q)
                );
            });
            render(filtered);
        }

        searchInput.addEventListener('input', filterCards);
        render(cards);
    })();

    (function setupLeaderboard() {
    const tableBody = document.getElementById("lb-body");
    if (!tableBody) return; // only on leaderboard page

    const prevBtn = document.getElementById("lb-prev");
    const nextBtn = document.getElementById("lb-next");
    const pageLabel = document.getElementById("lb-page-label");

    let currentPage = 1;

    async function loadPage(page) {
        try {
            const res = await fetch(`/api/leaderboard?page=${page}&pageSize=25`);
            if (!res.ok) throw new Error("Failed to fetch leaderboard");
            const data = await res.json();

            currentPage = data.page;
            pageLabel.textContent = `Page ${currentPage}`;

            tableBody.innerHTML = "";
            if (!data.results.length) {
                tableBody.innerHTML = `
                  <tr>
                    <td colspan="4" class="db-empty">
                      No scores yet. Be the first to set a record.
                    </td>
                  </tr>`;
                return;
            }

            data.results.forEach(row => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                  <td>${row.rank}</td>
                  <td>${row.name}</td>
                  <td>${row.score}</td>
                  <td>${row.mode || "default"}</td>
                `;
                tableBody.appendChild(tr);
            });

        } catch (err) {
            console.error(err);
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                loadPage(currentPage - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            loadPage(currentPage + 1);
        });
    }

    loadPage(1);
})();
