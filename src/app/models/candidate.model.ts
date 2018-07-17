export interface Candidate{
    id:number;
    firstName:string;
    lastName:string;
    middleName:string;
    description:string;
    city: string;
    postalCode:string;
    rankBySkills:number;
    skills: Array<number>;
    distance:number;
}