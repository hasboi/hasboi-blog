// aku tahu kodeku sangat berantakan...

document.addEventListener("DOMContentLoaded", () => {
	const initializeSketchyBorder = (button, isCircle = false) => {
		const canvas = document.createElement("canvas");
		button.style.position = "relative";
		canvas.style.position = "absolute";
		canvas.style.top = "0";
		canvas.style.left = "0";
		canvas.style.pointerEvents = "none";
		button.appendChild(canvas);

		const resizeCanvas = () => {
			canvas.width = button.offsetWidth + 20;
			canvas.height = button.offsetHeight + 20;
			canvas.style.top = `-${10}px`;
			canvas.style.left = `-${10}px`;
		};

		const drawBorder = () => {
			const rc = rough.canvas(canvas);
			const context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);

			let borderColor = "black";
			let strokeWidth = 1;

			if (button.classList.contains("landing-button")) {
				borderColor = "white";
				strokeWidth = 2;
			}

			if (isCircle) {
				const centerX = canvas.width / 2;
				const centerY = canvas.height / 2;
				const radius = Math.min(button.offsetWidth, button.offsetHeight) / 2;
				rc.circle(centerX, centerY, radius * 2, {
					roughness: 1.5,
					stroke: borderColor,
					strokeWidth: strokeWidth,
				});
			} else {
				rc.rectangle(10, 10, button.offsetWidth, button.offsetHeight, {
					roughness: 1.5,
					stroke: borderColor,
					strokeWidth: strokeWidth,
				});
			}
		};

		resizeCanvas();
		drawBorder();

		let hoverInterval;
		button.addEventListener("mouseenter", () => {
			hoverInterval = setInterval(drawBorder, 100);
		});

		button.addEventListener("mouseleave", () => {
			clearInterval(hoverInterval);
		});

		const resizeObserver = new ResizeObserver(() => {
			resizeCanvas();
			drawBorder();
		});
		resizeObserver.observe(button);
	};

	const sketchyButtons = document.querySelectorAll(".sketchy-button");
	sketchyButtons.forEach((button) => initializeSketchyBorder(button));

	const sketchyCircleButtons = document.querySelectorAll(
		".sketchy-circle-button"
	);
	sketchyCircleButtons.forEach((button) =>
		initializeSketchyBorder(button, true)
	);
});

document.addEventListener("DOMContentLoaded", () => {
	const initCanvasAnimation = (canvasId, isPlanetScene = false) => {
		const canvas = document.getElementById(canvasId);
		const rc = rough.canvas(canvas);
		let animationInterval;

		const resizeCanvas = () => {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		};
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		const isMobile = window.innerWidth < 768;

		const starCount = isMobile
			? isPlanetScene
				? 80
				: 50
			: isPlanetScene
			? 200
			: 250;

		const starStrokeWidth = isMobile ? 0.5 : 1.5;

		const stars = Array.from({ length: starCount }, () => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			size: Math.random() * 1 + 4,
		}));

		let planetCenterX, planetCenterY, planetRadius;
		if (isPlanetScene) {
			planetCenterX = isMobile ? canvas.width * 0.85 : canvas.width * 0.75;
			planetCenterY = isMobile ? canvas.height * 0.2 : canvas.height / 2;
			planetRadius = canvas.width * 0.1;
		}

		const isStarInsidePlanet = (starX, starY) => {
			if (!isPlanetScene) return false;
			const distance = Math.sqrt(
				Math.pow(starX - planetCenterX, 2) + Math.pow(starY - planetCenterY, 2)
			);
			return distance < planetRadius;
		};

		const validStars = stars.filter(({ x, y }) => !isStarInsidePlanet(x, y));

		const drawScene = () => {
			const context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);

			validStars.forEach(({ x, y, size }) => {
				rc.circle(x, y, size, {
					fill: "#ffeb9e",
					fillStyle: "solid",
					stroke: "none",
					strokeWidth: starStrokeWidth,
					roughness: 1.5,
				});
			});

			if (isPlanetScene) {
				rc.circle(planetCenterX, planetCenterY, planetRadius * 2, {
					fill: "#fdd9c1",
					fillStyle: "zigzag",
					stroke: "#f7b899",
					strokeWidth: 2,
					roughness: 0.8,
				});
			}
		};

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (!animationInterval) {
							animationInterval = setInterval(drawScene, 100);
						}
					} else {
						clearInterval(animationInterval);
						animationInterval = null;
					}
				});
			},
			{ threshold: 0.1 }
		);

		observer.observe(canvas);
	};

	initCanvasAnimation("planet-canvas", true);
	initCanvasAnimation("stars-canvas", false);
});

document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("stickman-canvas");
	const container = document.querySelector(".canvas-container");
	const rc = rough.canvas(canvas);

	const isMobile = window.innerWidth <= 768;

	const resizeCanvas = () => {
		canvas.width = container.offsetWidth;
		canvas.height = container.offsetHeight;
	};

	resizeCanvas();
	window.addEventListener("resize", resizeCanvas);

	let waveOffset = 0;
	let animationInterval = null;

	const drawStickman = () => {
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const angle = -15;

		const scaleFactor = isMobile ? 0.5 : 1;

		const rotatePoint = (x, y, cx, cy, angle) => {
			const radians = (Math.PI / 180) * angle;
			const cos = Math.cos(radians);
			const sin = Math.sin(radians);
			const nx = cos * (x - cx) - sin * (y - cy) + cx;
			const ny = sin * (x - cx) + cos * (y - cy) + cy;
			return { x: nx, y: ny };
		};

		const bodyTop = rotatePoint(
			centerX,
			centerY - 30 * scaleFactor,
			centerX,
			centerY,
			angle
		);
		const bodyBottom = rotatePoint(
			centerX,
			centerY + 20 * scaleFactor,
			centerX,
			centerY,
			angle
		);
		const headCenter = rotatePoint(
			centerX,
			centerY - 50 * scaleFactor,
			centerX,
			centerY,
			angle
		);
		const leftArm = rotatePoint(
			centerX - 25 * scaleFactor,
			centerY - 10 * scaleFactor,
			centerX,
			centerY,
			angle
		);
		const rightArm = rotatePoint(
			centerX + 25 * scaleFactor,
			centerY - 10 * scaleFactor,
			centerX,
			centerY,
			angle
		);
		const leftLeg = rotatePoint(
			centerX - 15 * scaleFactor,
			centerY + 50 * scaleFactor,
			centerX,
			centerY,
			angle
		);
		const rightLeg = rotatePoint(
			centerX + 15 * scaleFactor,
			centerY + 50 * scaleFactor,
			centerX,
			centerY,
			angle
		);

		rc.circle(headCenter.x, headCenter.y, 30 * scaleFactor, {
			stroke: "#f7b899",
			fill: "#fdd9c1",
			fillStyle: "zigzag",
			roughness: 1.5,
		});

		rc.line(bodyTop.x, bodyTop.y, bodyBottom.x, bodyBottom.y, {
			stroke: "#f7b899",
			roughness: 1.5,
		});

		rc.line(bodyTop.x, bodyTop.y, leftArm.x, leftArm.y, {
			stroke: "#f7b899",
			roughness: 1.5,
		});
		rc.line(bodyTop.x, bodyTop.y, rightArm.x, rightArm.y, {
			stroke: "#f7b899",
			roughness: 1.5,
		});

		rc.line(bodyBottom.x, bodyBottom.y, leftLeg.x, leftLeg.y, {
			stroke: "#f7b899",
			roughness: 1.5,
		});
		rc.line(bodyBottom.x, bodyBottom.y, rightLeg.x, rightLeg.y, {
			stroke: "#f7b899",
			roughness: 1.5,
		});

		const scarfColor = "#B0D7F2";
		const knotLeft = rotatePoint(
			centerX - 8 * scaleFactor,
			centerY - 32 * scaleFactor,
			centerX,
			centerY,
			angle
		);
		const knotRight = rotatePoint(
			centerX + 8 * scaleFactor,
			centerY - 32 * scaleFactor,
			centerX,
			centerY,
			angle
		);

		rc.line(knotLeft.x, knotLeft.y, knotRight.x, knotRight.y, {
			stroke: scarfColor,
			strokeWidth: 10 * scaleFactor,
			roughness: 1.5,
		});

		const scarfPoints = [];
		scarfPoints.push([knotRight.x, knotRight.y]);

		let currentX = knotRight.x;
		let currentY = knotRight.y;

		for (let i = 0; i < 3; i++) {
			const waveHeight = 4 * Math.sin((i * Math.PI) / 2 + waveOffset);
			const segmentLength = 30 * scaleFactor;
			currentX += segmentLength;
			currentY += waveHeight;

			scarfPoints.push([currentX, currentY]);
		}

		scarfPoints.forEach((point, idx) => {
			if (idx > 0) {
				const prevPoint = scarfPoints[idx - 1];
				rc.line(prevPoint[0], prevPoint[1], point[0], point[1], {
					stroke: scarfColor,
					strokeWidth: 3 * scaleFactor,
					roughness: 1.5,
				});
			}
		});
	};

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if (!animationInterval) {
						animationInterval = setInterval(() => {
							waveOffset += 1;
							drawStickman();
						}, 150);
					}
				} else {
					clearInterval(animationInterval);
					animationInterval = null;
				}
			});
		},
		{ threshold: 0.1 }
	);

	observer.observe(canvas);
});

document.addEventListener("DOMContentLoaded", () => {
	// posting
	const posts = [
		{
			title: "One Wayne G",
			content: "Album favoritku dari Mac Demarco",
			genres: ["Diary"],
		},
		{
			title: "Tujuh Belas",
			content: "17 Tahun, tapi masih bingung cara menjadi manusia.",
			genres: ["Diary"],
		},
		{
			title: "Taman Bunga Untukmu",
			content:
				"Cinta tidak meminta untuk dimiliki. Ia hanya ingin hidup, bahkan dalam kesunyian yang paling dalam.",
			genres: ["Cerpen", "Romance", "Surreal"],
		},
		{
			title: "Proton.sh",
			content:
				"Proton.sh adalah asisten belajar berbasis terminal yang lahir dari rasa malas, dirancang untuk membantu persiapan UTBK dengan cara yang (semoga) berguna.",
			genres: ["Diary", "Project"],
		},
		{
			title: "Oliver Clair",
			content:
				"Oliver Clair adalah sebuah kekuatan yang terlalu sempurna untuk tidak dipertanyakan.",
			genres: [
				"Cerpen",
				"Alt. History",
				"Sci-fi",
				"Satire",
				"Fiction",
				"Romance",
			],
		},
		{
			title: "Tentang Pangeran Kecil",
			content: "Novel favoritku!",
			genres: ["Cerpen", "Real life", "Review"],
		},
		{
			title: "Hello World!",
			content: "Tentang mylifestinyguidebook.",
			genres: ["Diary"],
		},
	];

	const postContainer = document.querySelector(".post-container");
	const paginationControls = document.querySelector(".pagination");
	const genreButtons = document.querySelectorAll(".genre-button");
	const searchInput = document.querySelector("#search-input");

	let selectedGenres = [];
	let searchQuery = "";
	let currentPage = 1;
	const postsPerPage = 5;

	const filterPosts = () => {
		return posts.filter((post) => {
			const matchesGenres =
				selectedGenres.length === 0 ||
				selectedGenres.every((genre) => post.genres.includes(genre));
			const matchesSearch =
				searchQuery === "" ||
				post.title.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesGenres && matchesSearch;
		});
	};

	const initializeSketchyBorderForPost = (postElement) => {
		const canvas = document.createElement("canvas");
		postElement.style.position = "relative";
		canvas.style.position = "absolute";
		canvas.style.top = "0";
		canvas.style.left = "0";
		canvas.style.pointerEvents = "none";
		postElement.appendChild(canvas);

		const resizeCanvas = () => {
			canvas.width = postElement.offsetWidth + 20;
			canvas.height = postElement.offsetHeight + 20;
			canvas.style.top = `-${10}px`;
			canvas.style.left = `-${10}px`;
		};

		const drawBorder = () => {
			const rc = rough.canvas(canvas);
			const context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);

			let borderColor = "black";
			let strokeWidth = 1.5;

			rc.rectangle(10, 10, postElement.offsetWidth, postElement.offsetHeight, {
				roughness: 2,
				stroke: borderColor,
				strokeWidth: strokeWidth,
			});
		};

		resizeCanvas();
		drawBorder();

		let hoverInterval;
		postElement.addEventListener("mouseenter", () => {
			hoverInterval = setInterval(drawBorder, 100);
		});

		postElement.addEventListener("mouseleave", () => {
			clearInterval(hoverInterval);
		});

		const resizeObserver = new ResizeObserver(() => {
			resizeCanvas();
			drawBorder();
		});
		resizeObserver.observe(postElement);
	};
	const renderPosts = (filteredPosts) => {
		postContainer.innerHTML = "";
		const start = (currentPage - 1) * postsPerPage;
		const end = start + postsPerPage;
		const paginatedPosts = filteredPosts.slice(start, end);

		if (paginatedPosts.length === 0) {
			postContainer.innerHTML =
				"<p>Tidak ada postingan dengan kriteria itu.</p>";
			return;
		}

		paginatedPosts.forEach((post) => {
			const slug = post.title.toLowerCase().replace(/\s+/g, "-");
			const postLink = document.createElement("a");
			postLink.href = `${slug}.html`;
			postLink.classList.add("post", "sketchy-button");
			postLink.innerHTML = `
      <h3 class="post-title">${post.title}</h3>
      <p class="post-genres">Kategori: ${post.genres.join(", ")}</p>
      <p>${post.content}</p>
    `;

			initializeSketchyBorderForPost(postLink);

			postContainer.appendChild(postLink);
		});
	};

	const updatePaginationControls = (totalPosts) => {
		const totalPages = Math.ceil(totalPosts / postsPerPage);
		paginationControls.innerHTML = `
      <button class="pagination-button prev sketchy-hover" ${
				currentPage === 1 ? "disabled" : ""
			}>Prev</button>
      <span class="current-page">Page ${currentPage} of ${totalPages}</span>
      <button class="pagination-button next sketchy-hover" ${
				currentPage === totalPages ? "disabled" : ""
			}>Next</button>
    `;

		document
			.querySelector(".pagination-button.prev")
			.addEventListener("click", () => {
				if (currentPage > 1) {
					currentPage--;
					updateView();
				}
			});

		document
			.querySelector(".pagination-button.next")
			.addEventListener("click", () => {
				if (currentPage < totalPages) {
					currentPage++;
					updateView();
				}
			});
		const initializeSketchyBorder = (button, isCircle = false) => {
			const canvas = document.createElement("canvas");
			button.style.position = "relative";
			canvas.style.position = "absolute";
			canvas.style.top = "0";
			canvas.style.left = "0";
			canvas.style.pointerEvents = "none";
			button.appendChild(canvas);

			const resizeCanvas = () => {
				canvas.width = button.offsetWidth + 20;
				canvas.height = button.offsetHeight + 20;
				canvas.style.top = `-${10}px`;
				canvas.style.left = `-${10}px`;
			};

			const drawBorder = () => {
				const rc = rough.canvas(canvas);
				const context = canvas.getContext("2d");
				context.clearRect(0, 0, canvas.width, canvas.height);
				rc.rectangle(10, 10, button.offsetWidth, button.offsetHeight, {
					roughness: 1.5,
					stroke: "black",
					strokeWidth: 1.5,
				});
			};

			resizeCanvas();
			drawBorder();

			let hoverInterval;
			button.addEventListener("mouseenter", () => {
				hoverInterval = setInterval(drawBorder, 100);
			});

			button.addEventListener("mouseleave", () => {
				clearInterval(hoverInterval);
			});

			const resizeObserver = new ResizeObserver(() => {
				resizeCanvas();
				drawBorder();
			});
			resizeObserver.observe(button);
		};

		const prevButton = document.querySelector(".pagination-button.prev");
		const nextButton = document.querySelector(".pagination-button.next");
		initializeSketchyBorder(prevButton);
		initializeSketchyBorder(nextButton);
	};

	const updateView = () => {
		const filteredPosts = filterPosts();
		renderPosts(filteredPosts);
		updatePaginationControls(filteredPosts.length);
	};

	genreButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const genre = button.getAttribute("data-genre");

			if (selectedGenres.includes(genre)) {
				selectedGenres = selectedGenres.filter((g) => g !== genre);
				button.classList.remove("active");
			} else {
				selectedGenres.push(genre);
				button.classList.add("active");
			}

			currentPage = 1;
			updateView();
		});
	});

	searchInput.addEventListener("input", (e) => {
		searchQuery = e.target.value;
		currentPage = 1;
		updateView();
	});

	updateView();
});

document.addEventListener("DOMContentLoaded", () => {
	const searchInput = document.querySelector("#search-input");

	const initializeSearchBarBorder = () => {
		const canvas = document.createElement("canvas");
		const rc = rough.canvas(canvas);

		canvas.style.position = "absolute";
		canvas.style.top = "0";
		canvas.style.left = "0";
		canvas.style.pointerEvents = "none";
		canvas.style.zIndex = "2";
		searchInput.parentElement.appendChild(canvas);

		const updateCanvasSize = () => {
			canvas.width = searchInput.offsetWidth + 40;
			canvas.height = searchInput.offsetHeight + 40;
			canvas.style.top = `-${20}px`;
			canvas.style.left = `-${20}px`;
		};

		const drawBorder = () => {
			const ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			rc.rectangle(20, 20, searchInput.offsetWidth, searchInput.offsetHeight, {
				roughness: 1.5,
				stroke: "black",
				strokeWidth: 2,
			});
		};

		let animationInterval;
		const startAnimatingBorder = () => {
			if (!animationInterval) animationInterval = setInterval(drawBorder, 100);
		};
		const stopAnimatingBorder = () => {
			clearInterval(animationInterval);
			animationInterval = null;
		};

		const applyHoverEffects = () => {
			searchInput.style.backgroundColor = "#fdf6e3";
			searchInput.style.color = "#333";
			startAnimatingBorder();
		};

		const removeHoverEffects = () => {
			if (!searchInput.value) {
				searchInput.style.backgroundColor = "#222";
				searchInput.style.color = "#fdf6e3";
				stopAnimatingBorder();
			} else {
				startAnimatingBorder();
			}
		};

		searchInput.addEventListener("mouseenter", applyHoverEffects);
		searchInput.addEventListener("mouseleave", removeHoverEffects);

		searchInput.addEventListener("focus", applyHoverEffects);
		searchInput.addEventListener("blur", removeHoverEffects);

		searchInput.addEventListener("input", () => {
			if (searchInput.value) {
				searchInput.style.backgroundColor = "#222";
				searchInput.style.color = "#fdf6e3";
				startAnimatingBorder();
			} else {
				removeHoverEffects();
			}
		});

		const resizeObserver = new ResizeObserver(() => {
			updateCanvasSize();
			drawBorder();
		});
		resizeObserver.observe(searchInput);

		updateCanvasSize();
		drawBorder();
	};

	initializeSearchBarBorder();
});

document.addEventListener("DOMContentLoaded", () => {
	const canvasContainer = document.querySelector(".canvas-container");
	const tooltip = document.querySelector(".tooltip");

	let targetX = 0;
	let targetY = 0;
	let currentX = 0;
	let currentY = 0;

	const easeFactor = 0.3;

	const animateTooltip = () => {
		const dx = targetX - currentX;
		const dy = targetY - currentY;

		currentX += dx * easeFactor;
		currentY += dy * easeFactor;

		tooltip.style.left = `${currentX}px`;
		tooltip.style.top = `${currentY}px`;

		requestAnimationFrame(animateTooltip);
	};

	animateTooltip();

	canvasContainer.addEventListener("mousemove", (event) => {
		const containerRect = canvasContainer.getBoundingClientRect();
		targetX = event.clientX - containerRect.left;
		targetY = event.clientY - containerRect.top;

		tooltip.style.opacity = 1;
	});

	canvasContainer.addEventListener("mouseleave", () => {
		tooltip.style.opacity = 0;
	});
});

const emailInput = document.querySelector(".subs-section .sketchy-input");
const emailInputContainer = document.querySelector("#email-subs");

const canvas = document.createElement("canvas");
emailInputContainer.appendChild(canvas);

const rc = rough.canvas(canvas);

document.addEventListener("DOMContentLoaded", () => {
	const emailInput = document.querySelector("#email-input");
	const emailForm = document.querySelector("#email-form");
	if (!emailInput || !emailForm) return;

	const emailFormCanvas = document.createElement("canvas");
	emailFormCanvas.id = "email-form-border";
	emailFormCanvas.style.position = "absolute";
	emailFormCanvas.style.pointerEvents = "none";
	emailForm.prepend(emailFormCanvas);

	const rc = rough.canvas(emailFormCanvas);

	const resizeCanvas = () => {
		const rect = emailInput.getBoundingClientRect();
		emailFormCanvas.width = rect.width + 20;
		emailFormCanvas.height = rect.height + 20;
		emailFormCanvas.style.top = `${emailInput.offsetTop - 10}px`;
		emailFormCanvas.style.left = `${emailInput.offsetLeft - 10}px`;
	};

	const drawRoughBorder = () => {
		const rect = emailInput.getBoundingClientRect();
		const context = emailFormCanvas.getContext("2d");
		context.clearRect(0, 0, emailFormCanvas.width, emailFormCanvas.height);
		rc.rectangle(10, 10, rect.width, rect.height, {
			roughness: 1.5,
			stroke: "black",
			strokeWidth: 1,
		});
	};

	resizeCanvas();
	drawRoughBorder();

	let animationInterval;

	const startAnimation = () => {
		clearInterval(animationInterval);
		animationInterval = setInterval(drawRoughBorder, 100);
	};

	const stopAnimation = () => {
		clearInterval(animationInterval);
		drawRoughBorder();
	};

	emailInput.addEventListener("mouseenter", startAnimation);
	emailInput.addEventListener("focus", startAnimation);
	emailInput.addEventListener("mouseleave", () => {
		if (document.activeElement !== emailInput) {
			stopAnimation();
		}
	});
	emailInput.addEventListener("blur", stopAnimation);

	const resizeObserver = new ResizeObserver(() => {
		resizeCanvas();
		drawRoughBorder();
	});
	resizeObserver.observe(emailInput);
});

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".rough-star").forEach((star) => {
		const canvas = document.createElement("canvas");
		canvas.width = 100;
		canvas.height = 100;
		star.appendChild(canvas);

		const rc = rough.canvas(canvas);

		rc.polygon(
			[
				[50, 0],
				[70, 34],
				[100, 50],
				[70, 66],
				[50, 100],
				[30, 66],
				[0, 50],
				[30, 34],
			],
			{
				stroke: "#fdf6e3",
				strokeWidth: 1.5,
				roughness: 1.5,
				fill: "#fdf6e3",
			}
		);
	});
});

document.addEventListener("DOMContentLoaded", () => {
	const genreFilters = document.getElementById("genre-filters");
	const shadowLeft = document.querySelector(".shadow-left");
	const shadowRight = document.querySelector(".shadow-right");

	const updateShadows = () => {
		const scrollLeft = genreFilters.scrollLeft;
		const maxScrollLeft = genreFilters.scrollWidth - genreFilters.clientWidth;

		const tolerance = 5;

		shadowLeft.style.opacity = scrollLeft > tolerance ? "1" : "0";

		shadowRight.style.opacity =
			scrollLeft < maxScrollLeft - tolerance ? "1" : "0";
	};

	genreFilters.addEventListener("scroll", updateShadows);
	updateShadows();
});

document.addEventListener("DOMContentLoaded", () => {
	const feedbackSign = document.getElementById("feedback-sign");
	const form = document.getElementById("email-form");
	const submitButton = form.querySelector("button[type='submit']");

	function showFeedback(message, isError = false) {
		feedbackSign.textContent = message;
		feedbackSign.style.display = "block";
		feedbackSign.style.backgroundColor = isError ? "#ff4d4d" : "#111";
		feedbackSign.style.color = "#fdf6e3";
		initializeSketchyBorder(feedbackSign);

		const intervalId = setInterval(() => {
			drawBorder(feedbackSign);
		}, 500);

		setTimeout(() => {
			feedbackSign.style.display = "none";
			clearInterval(intervalId);
		}, 3000);
	}

	form.addEventListener("submit", (e) => {
		e.preventDefault();

		submitButton.disabled = true;

		const email = document.getElementById("email-input").value;
		showFeedback("Sedang mengirim...");

		const formData = new FormData(form);

		fetch(
			"https://script.google.com/macros/s/AKfycbwAm8ZlrUJ1Vk2q5xYFKK_vqhTa4wrrGb1GG_Ae_P42lDy7qeNOU1SO2qHFllTkRRbh/exec",
			{
				method: "POST",
				body: formData,
			}
		)
			.then((response) => response.json())
			.then((data) => {
				if (data.result === "success") {
					showFeedback("Berhasil! (Jangan lupa ngecek email sering-sering ya)");
				} else if (data.error && data.error.includes("already exists")) {
					showFeedback("Email sudah terdaftar!", true);
				} else {
					showFeedback("Terjadi kesalahan, coba lagi.", true);
				}
			})
			.catch((error) => {
				showFeedback("Terjadi kesalahan koneksi.", true);
			})
			.finally(() => {
				submitButton.disabled = false;
			});
	});

	const initializeSketchyBorder = (element) => {
		const canvas = document.createElement("canvas");
		element.style.position = "fixed";
		canvas.style.position = "absolute";
		canvas.style.top = "0";
		canvas.style.left = "0";
		canvas.style.pointerEvents = "none";
		element.appendChild(canvas);

		const resizeCanvas = () => {
			canvas.width = element.offsetWidth + 20;
			canvas.height = element.offsetHeight + 20;
			canvas.style.top = `-${10}px`;
			canvas.style.left = `-${10}px`;
		};

		const drawBorder = () => {
			const rc = rough.canvas(canvas);
			const context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);

			rc.rectangle(10, 10, element.offsetWidth, element.offsetHeight, {
				roughness: 1.5,
				stroke: "black",
				strokeWidth: 1,
			});
		};
		setInterval(drawBorder, 100);

		resizeCanvas();
		drawBorder();

		const resizeObserver = new ResizeObserver(() => {
			resizeCanvas();
			drawBorder();
		});
		resizeObserver.observe(element);
	};
});

window.onload = function () {
	const postElement = document.querySelector(".blog-post");
	const imageElement = document.querySelector(".post-image img");

	const roughCanvasPost = rough.canvas(postElement);

	roughCanvasPost.rectangle(
		0,
		0,
		postElement.offsetWidth,
		postElement.offsetHeight,
		{
			roughness: 2.8,
			stroke: "#fdf6e3",
			strokeWidth: 2,
		}
	);
	const roughCanvasImage = rough.canvas(imageElement.parentElement);

	roughCanvasImage.rectangle(
		0,
		0,
		imageElement.offsetWidth,
		imageElement.offsetHeight,
		{
			roughness: 2.5,
			stroke: "#fdf6e3",
			strokeWidth: 2,
		}
	);
};
