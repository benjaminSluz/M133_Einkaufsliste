"use strict";
import { Application, Router, renderFileToString } from "./deps.js";

let shoppingList = [
    { id: 0, name: "Brot" },
    { id: 1, name: "Milch" },
    { id: 2, name: "Bananen" },
];

const app = new Application();
const router = new Router();

let counter = 3;

router.get("/", async(ctx) => {
    ctx.response.body = await renderFileToString(Deno.cwd() + "/index.ejs", {
        title: "Einkaufsliste",
        products: shoppingList,
    });
});

router.post("/addProduct", async(ctx) => {
    let formContent = await ctx.request.body({ type: "form" }).value; // Input vom Formular wird übergeben
    let nameValue = formContent.get("newProductName"); // newProductName wird ausgelesen

    console.log("Ein addProduct post request erhalten für: " + nameValue);

    if (nameValue) {
        shoppingList.push({ id: counter++, name: nameValue } // Nimmt die nächsthöhere Nummer
        );
    }

    ctx.response.redirect("/"); // Zur Startseite weiterführen
});

router.delete("/deleteProduct/:id", async(ctx) => {
    let id = Number.parseInt(ctx.params.id); //Id aus dem Pfad lesen
    let item = shoppingList.find((value) => value.id === id); //Item mit der Id in shoppingList suchen

    if (item) {
        let index = shoppingList.indexOf(item);
        shoppingList.splice(index, 1); //Item wird aus shoppingList entfernt
        console.log(item.name + " wurde gelöscht");
    }
    ctx.response.redirect("/"); // Zur Startseite weiterführen
});

router.put("/updateProduct/:id", async(ctx) => {
    let id = Number.parseInt(ctx.params.id); //Id aus dem Pfad lesen
    let formContent = await ctx.request.body({ type: "form" }).value; // Input vom Formular wird übergeben
    let change = formContent.get("name"); // name wird ausgelesen
    let item = shoppingList.find((value) => value.id === id); //Item mit der Id in shoppingList suchen

    if (item) {
        item.name = change; //Item wird neuer Name gesetzt.
        console.log(item.id + " hat nun den namen: " + item.name);
    }
    ctx.response.redirect("/"); // Zur Startseite weiterführen
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", () => {
    console.log("Server läuft");
});

await app.listen({ port: 8000 });