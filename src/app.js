const { Socket } = require("socket.io");

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const document = {};

io.on("connection",socket=>{
    let previousId;

    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId,()=>
            console.log(`Socket ${socket.id} joined room ${currentId}`)
        );
    }

    socket.on("getDoc",docId =>{
        safeJoin(docId);
        socket.emit("document",documents[docId]);
    });

    socket.on("editDoc",doc=>{
        documents[doc.id] = doc;
        socket.to(doc.id).emit("document",doc);
    });

    socket.on("addDoc",doc =>{
        documents[doc.id] = doc;
        safeJoin(doc.id);
        io.emit("documents",Object.keys(documents));
        socket.emit("document",doc);
    });

    io.emit("documents",Object.keys(documents));
    console.log(`Socket ${socket.id} has connected`);
});

http.listen(3000,()=>{
    console.log("Running on Port 3000");
})

app.get("/",function(req,res){
    res.send("socket opened");
});