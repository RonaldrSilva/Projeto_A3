// =========================
// SKELETON LOADING
// =========================

// =========================
// EXIBIR SKELETONS
// =========================

function exibirSkeletons(container, quantidade = 6) {

    const skeletonsHTML = Array
        .from({ length: quantidade }, () => `
        
        <div class="col-12 col-md-6 col-lg-4 produto-col">

            <article class="produto-card skeleton-card">

                <div class="skeleton skeleton-image"></div>

                <div class="produto-card-body">

                    <div class="skeleton skeleton-title"></div>

                    <div class="skeleton skeleton-category"></div>

                    <div class="skeleton skeleton-price"></div>

                    <div class="produto-actions">

                        <div class="skeleton skeleton-button"></div>

                        <div class="produto-actions-row">

                            <div class="skeleton skeleton-button skeleton-button-small"></div>

                            <div class="skeleton skeleton-favorite"></div>

                        </div>

                    </div>

                </div>

            </article>

        </div>
    `)
        .join('');

    container.innerHTML = skeletonsHTML;
}