const stars = document.getElementById('stars-count');

// Get stars count
fetch('https://api.github.com/repos/ahmadreza-log/github-tools')
    .then(response => response.json())
    .then(data => stars.textContent = data.stargazers_count)
    .catch(error => console.error('Error:', error));

const repos = document.getElementById('repos');

const list = [
    'https://github.com/badges/shields',
    'https://github.com/simple-icons/simple-icons-website-rs'
]

list.forEach(link => {
    link = link.replace('github.com', 'api.github.com/repos');

    const element = document.createElement('div');
    element.classList.add('animate-pulse', 'h-40', 'w-full', 'bg-gray-800', 'rounded-md', 'p-4');

    fetch(link)
        .then(response => response.json())
        .then(data => {
            element.classList.remove('animate-pulse', 'h-40');
            element.innerHTML = `
                <h3 class="text-lg font-bold mb-4">${data.name}</h3>
                <p class="text-gray-400 text-sm border-b border-gray-700 pb-4 mb-4">${data.description}</p>
                <div class="flex gap-4">
                    <a href="${data.html_url}" class="px-2 py-2 rounded-md flex gap-2 text-white bg-gray-800 hover:bg-gray-700 transition-all duration-300 items-center justify-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M10 20.568c-3.429 1.157-6.286 0-8-3.568"/><path d="M10 22v-3.242c0-.598.184-1.118.48-1.588c.204-.322.064-.78-.303-.88C7.134 15.452 5 14.107 5 9.645c0-1.16.38-2.25 1.048-3.2c.166-.236.25-.354.27-.46c.02-.108-.015-.247-.085-.527c-.283-1.136-.264-2.343.16-3.43c0 0 .877-.287 2.874.96c.456.285.684.428.885.46s.469-.035 1.005-.169A9.5 9.5 0 0 1 13.5 3a9.6 9.6 0 0 1 2.343.28c.536.134.805.2 1.006.169c.2-.032.428-.175.884-.46c1.997-1.247 2.874-.96 2.874-.96c.424 1.087.443 2.294.16 3.43c-.07.28-.104.42-.084.526s.103.225.269.461c.668.95 1.048 2.04 1.048 3.2c0 4.462-2.134 5.807-5.177 6.643c-.367.101-.507.559-.303.88c.296.47.48.99.48 1.589V22"/></g></svg>
                    </a>
                    <a href="${data.stargazers_url}" class="px-2 py-2 rounded-md flex gap-2 text-white bg-gray-800 hover:bg-gray-700 transition-all duration-300 items-center justify-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="m7.625 6.4l2.8-3.625q.3-.4.713-.587T12 2t.863.188t.712.587l2.8 3.625l4.25 1.425q.65.2 1.025.738t.375 1.187q0 .3-.088.6t-.287.575l-2.75 3.9l.1 4.1q.025.875-.575 1.475t-1.4.6q-.05 0-.55-.075L12 19.675l-4.475 1.25q-.125.05-.275.063T6.975 21q-.8 0-1.4-.6T5 18.925l.1-4.125l-2.725-3.875q-.2-.275-.288-.575T2 9.75q0-.625.363-1.162t1.012-.763zM8.85 8.125L4 9.725L7.1 14.2L7 18.975l5-1.375l5 1.4l-.1-4.8L20 9.775l-4.85-1.65L12 4zM12 11.5"/></svg>
                        ${data.stargazers_count}
                    </a>
                    <a href="${data.homepage}" class="px-2 py-2 rounded-md flex gap-2 text-white bg-gray-800 hover:bg-gray-700 transition-all duration-300 items-center justify-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M9.206 3.182A9.25 9.25 0 0 0 2.78 11.25h4.48c.033-1.096.135-2.176.305-3.2c.207-1.254.515-2.41.91-3.4a9.3 9.3 0 0 1 .731-1.468M12 1.25a10.75 10.75 0 1 0 0 21.5a10.75 10.75 0 0 0 0-21.5m0 1.5c-.261 0-.599.126-.991.532c-.396.41-.791 1.051-1.141 1.925c-.347.869-.63 1.917-.824 3.089c-.155.94-.25 1.937-.282 2.954h6.476a22.5 22.5 0 0 0-.282-2.954c-.194-1.172-.477-2.22-.824-3.089c-.35-.874-.745-1.515-1.14-1.925c-.393-.406-.73-.532-.992-.532m4.74 8.5a24 24 0 0 0-.305-3.2c-.207-1.254-.515-2.41-.91-3.4a9.3 9.3 0 0 0-.732-1.468a9.24 9.24 0 0 1 3.748 2.277a9.25 9.25 0 0 1 2.678 5.791zm-1.502 1.5H8.762c.031 1.017.127 2.014.282 2.954c.194 1.172.477 2.22.824 3.089c.35.874.745 1.515 1.14 1.925c.393.406.73.532.992.532c.261 0 .599-.126.991-.532c.396-.41.791-1.051 1.141-1.925c.347-.869.63-1.917.824-3.089c.155-.94.25-1.937.282-2.954m-.444 8.068c.27-.434.515-.929.73-1.468c.396-.99.704-2.146.911-3.4a24 24 0 0 0 .304-3.2h4.48a9.25 9.25 0 0 1-6.426 8.068m-5.588 0a9.3 9.3 0 0 1-.73-1.468c-.396-.99-.704-2.146-.911-3.4a24 24 0 0 1-.304-3.2H2.78a9.25 9.25 0 0 0 6.425 8.068" clip-rule="evenodd"/></svg>
                    </a>
                </div>
            `;
        })
        .catch(error => console.error('Error:', error));

    repos.appendChild(element);

    // const Element = document.createElement('div');
    // Element.classList.add('bg-gray-800', 'p-4', 'rounded-md');
    // Element.innerHTML = `
    //     <div class="flex gap-4">
    //         <a href="${repo.url}" class="px-3 py-2 rounded-md flex gap-2 text-white bg-gray-800 hover:bg-gray-700 transition-all duration-300 items-center justify-center text-sm">
    //             <svg role="img" fill="currentColor" viewBox="0 0 24 24" width="18" height="18"
    //                 xmlns="http://www.w3.org/2000/svg">
    //                 <path
    //                     d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    //             </svg>
    //             View On Github
    //         </a>
    //     </div>
    // `;
    // Repos.appendChild(Element);
});