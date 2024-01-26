const regs ={
    email:/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    telephone:/^[1][3,4,5,6,7,8,9][0-9]{9}$/,
    password:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
    number:/^([0]|[1-9][0-9]*)$/,
}
// const verify=(rule,value,reg,callback)=>{
//     if(value){
//         if(reg.test(value)){
//             callback()
//         }else {
//             callback(new Error(rule.message))
//         }
//     }else {
//         callback();
//     }
// }

const verify = (rule, value, reg, callback) => {
    if (!value || value.trim() === "") {
        // 检查是否为空或只包含空格
        callback(new Error("不能为空"));
    } else if (reg.test(value)) {
        callback();
    } else {
        callback(new Error(rule.message));
    }
};

export default {
    email: (rule,value,callback)=>{
        return verify(rule,value,regs.email,callback)
},
    number: (rule,value,callback)=>{
        return verify(rule,value,regs.number,callback)
    },
    password: (rule,value,callback)=>{
        return verify(rule,value,regs.password,callback)
    },
    telephone: (rule,value,callback)=>{
        return verify(rule,value,regs.telephone,callback)
    }

}
