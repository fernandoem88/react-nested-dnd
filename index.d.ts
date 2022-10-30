export interface LoaderComponentData {
  props: { [key: string]: any }

  // to help avoiding props duplications in the component interface
  classNamesMemo: Set<string>
  // { "$props-key": "Component--class-name" }
  classNamesPropsMapping: { [key: string]: any }
  hasProps: boolean
}

export declare const styleParser: (style: any) => {
  [component: string]: ClassNamesParser<any>
}

export type ClassNamesParser<P = {}> = (
  $cn?: P & { className?: string }
) => string

type ParseClassKey<K extends string> = K extends `${infer P1}-${infer P2}`
  ? ParseClassKey<`${P1}${Capitalize<P2>}`>
  : K

export declare const classNamesMapping = <
  T extends Record<string, string | { [K: string]: string }>
>(
  classnames?: T
) => {
  type Params = {
    [K in keyof T as ParseClassKey<K & string>]?: T[K] extends string
      ? boolean
      : keyof T[K]
  }

  return (
    params?: Params & {
      className?: string
    }
  ) => string
}
