declare module '*.xlsx?url' {
  const content: string;
  export default content;
}
 
declare module '*.xlsx' {
  const content: string;
  export default content;
} 