const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const bodyParser = require("koa-bodyparser")


const app = new Koa();
const router = new Router();
app.use(cors());
app.use(bodyParser());



//permet de compter le nombre de connexion
const session = require('koa-session');

//il est necessaire de fournir un tableau de keys pour pouvoir compter les sessions
app.keys = ['what a great key'];
//on passe app au middleware session qui nous met à dispo les sessions
app.use(session(app));


//met à jour le compteur
app.use((ctx, next) => {
  // console.log("ctx", ctx);
  // ctx.body = "<hl>hello world</hl>";
  if (ctx.path === '/favicon.ico') return; //permet d'évite que favicon compte pour 1 session sur chrome


  //on recupère counter depuis la propriété session (get), ensuite on incrémente, on fait ensuite on set car on passe à ctx.session.counter une nouvelle valeur, puis on affiche la valeur dans le body.
  let counter = ctx.session.counter || 0;
  counter = ++counter;
  ctx.session.counter = counter;
  // ctx.body = `Vous êtes venu ${counter} fois`;
  next();
});

//definition de routes vers users/id et une route vers la page d'accueil
router
  .get('/users/:id', async (ctx) => {
    const id = ctx.params.id;
    //await Users.findOne by id
    console.log('query params', ctx.query); //permet de recup les paramètres
    console.log('ctx.query.color', ctx.query.color);
    const counter = ctx.session.counter;
    ctx.body = `Visite n° ${counter} de l'utilisateur avec l'id ${id};`
  })
  .get('/', (ctx) => {
    ctx.body = "Hello Koa"
  })
  .post('/', (ctx) => {
    console.log('ctx.request.body', ctx.request.body);
    ctx.body = { ...ctx.request.body, date: new Date() };
  })

app.use(router.routes()).use(router.allowedMethods());

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});