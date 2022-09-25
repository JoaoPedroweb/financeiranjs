
const { request, response } = require("express");
const express = require ("express");
const {v4: uuidv4 } = require("uuid")
const app = express();

app.use(express.json());

const customers = [];
//middleware
function verifyIfExistsAcccountCPF(request, response, next) {
    const { cpf } = request.headers;

    const customer = customers.find((customer ) => customer.cpf === cpf);

    if (!customer) { 
        return response.status(400).json({error:"customer not foun"});
      }

      request.customer= customer;
    return next();  
}

app.post ("/account", (request, response) =>{
    const { cpf, name }  = request.body;
    const customerAlreadyExists = customers.some(
     (customer) => customers.cpf === cpf
    ); 
    if(customerAlreadyExists) {
      return response.status(400).json({erro: "customer already exists!"});
        
    }
   
customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
});
  return response.status(201).send();
});

app.get("/statement", verifyIfExistsAcccountCPF, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);

});

app.post("/deposit",verifyIfExistsAcccountCPF, (request, response)=>{
 const {description, amount} = request.body;
 const { customer } = request;
 const statementOperation= {
   description,
   amount,
   created_at: new Date(),
   type: "credit",
 };
  customer.statement.push(statementOperation);

  return response.status(201).send();
});

app.get("/statement/date", verifyIfExistsAcccountCPF, (request, response) => {
    const { customer } = request;
    const { date } = request.query;

   const dateFormat = new Date(date + " 00:00");

   const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === 
   new Date (dateFormat).toDateString())



    return response.json(statement);
  
  });

  app.put("/account", verifyIfExistsAcccountCPF, (request, response) =>{
     const { name } = request.body;
     const { customer } = request;
          
         customer.name = name;

     return response.status(201).send();
  });

   app.get("/account", verifyIfExistsAcccountCPF, (request, response) =>{
     const { customer } = request;

     return response.json(customers);
   });

 app.delete("/account", verifyIfExistsAcccountCPF, (request, response) => {
   const { customer } = request;
  
   //splice
   customers.slice(customer, 1);

   return response.status(200).json(customers);

 });

app.listen(3333);