import { TagType } from "src/tag"

const topic = {
	__label__abstraction: "abstraction",
	__label__attribute: "attribute",
	__label__class: "class",
	__label__encapsulation: "encapsulation",
	__label__inheritance: "inheritance",
	__label__method: "method",
	__label__object: "object",
	__label__oop: "oop",
	__label__oop_principle: "oop_principle",
	__label__polymorphism: "polymorphism",
}

const type = {
	__label__definition: TagType.question,
	__label__example: TagType.example,
	__label__exercise: TagType.post,
	__label__login: "login",
	__label__menu: TagType.menu,
	__label__welcome: "welcome",
}

const o = {
	topic: topic,
	type: type,
}

export default o