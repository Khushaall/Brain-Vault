export function random (len: number) : string {

    let options = "jakdofjiernklalshef1234567890jbbsdjf zcvbnmqwery"
    let ans=""

    for(let i=0;i<len;i++){

        ans +=options[Math.floor((Math.random() * options.length))]
    }
    
    return ans;
}