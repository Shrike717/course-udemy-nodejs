// This code runs in Browser on Client side:
const deleteProduct = (btn) => {
	const prodId = btn.parentNode.querySelector("[name=productId]").value;
	const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;

    const productElement = btn.closest("article");

	fetch("/admin/product/" + prodId, {
		method: "DELETE",
		headers: {
			"csrf-token": csrfToken,
		},
	})
		.then((result) => {
			return result.json();
		})
        .then(data => {
            console.log(data); // Extracting JSON data from response body (example)
            // productElement.remove(); // Only modern browsers, not IE
            productElement.parentNode.removeChild(productElement); // Works for all browsers
        })
		.catch((err) => {
			console.log(err);
		});
};
