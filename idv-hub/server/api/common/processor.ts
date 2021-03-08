
export class Processor {
    public toSimpleDate(date: string) :string{
        if(date) {
            return new Date(date).toISOString().substring(0, 10);
        }else{
            return null
        }
    }
}

export default new Processor();