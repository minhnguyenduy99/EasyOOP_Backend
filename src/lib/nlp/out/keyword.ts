const keyword = [
	{
		topic: "__label__single_responsibility",
		key: ["single responsibility","trách nhiệm duy nhất","nguyên tắc trách nhiệm duy nhất"]
	},
	{
		topic: "__label__dependency_inversion",
		key: ["dependency inversion","đảo ngược phụ thuộc","nguyên tắc đảo ngược phụ thuộc"]
	},
	{
		topic: "__label__liskov_substitution",
		key: ["liskov","liskov substitution","khả dĩ thay thế","nguyên tắc khả dĩ thay thế"]
	},
	{
		topic: "__label__interface_segregation",
		key: ["interface segregation","chia nhỏ interface","nguyên tắc chia nhỏ interface"]
	},
	{
		topic: "__label__protected_def",
		key: ["protected","phạm vi truy cập protected"]
	},
	{
		topic: "__label__open_closed",
		key: ["open closed","open close","đóng và mở","nguyên tắc đóng và mở"]
	},
	{
		topic: "__label__private_def",
		key: ["private","phạm vi truy cập private"]
	},
	{
		topic: "__label__public_def",
		key: ["public","phạm vi truy cập public"]
	},
	{
		topic: "__label__oop",
		key: ["oop","object oriented programming","hướng đối tượng","lập trình hướng đối tượng"]
	},
	{
		topic: "__label__scope_def",
		key: ["scope","phạm vi truy cập","tầm vực"]
	},
	{
		topic: "__label__abstraction_method",
		key: ["abstraction method","abstract method","trừu tượng","hàm trừu tượng","hàm ảo"]
	},
	{
		topic: "__label__abstraction_class",
		key: ["abstraction class","abstract class","lớp ảo","lớp trừu tượng"]
	},
	{
		topic: "__label__abstract_factory",
		key: ["abstract factory","abstract factory pattern"]
	},
	{
		topic: "__label__friend_function",
		key: ["friend method","friend function","hàm bạn","phương thức bạn"]
	},
	{
		topic: "__label__mutiinheritance",
		key: ["mutiinheritance","đa kế thừa"]
	},
	{
		topic: "__label__principle_solid",
		key: ["principle solid","nguyên tắc solid","solid"]
	},
	{
		topic: "__label__design_pattern",
		key: ["design pattern","mẫu thiết kế"]
	},
	{
		topic: "__label__behavioral",
		key: ["behavioral","mẫu hành vi"]
	},
	{
		topic: "__label__creational",
		key: ["creational","creational pattern","mẫu khởi tạo"]
	},
	{
		topic: "__label__virtual",
		key: ["virtual","hàm ảo","phương thức ảo"]
	},
	{
		topic: "__label__static",
		key: ["static","static field","static method","tĩnh","hàm tĩnh","phương thức tĩnh","trường tĩnh"]
	},
	{
		topic: "__label__dry",
		key: ["dry","dont repeat yourself"]
	},
	{
		topic: "__label__uml",
		key: ["uml","sơ đồ lớp"]
	},
	{
		topic: "__label__template_design",
		key: ["template","template pattern"]
	},
	{
		topic: "__label__derived_class",
		key: ["derived class","child class","subclass","class con","lớp con"]
	},
	{
		topic: "__label__encapsulation",
		key: ["encapsulation","đóng gói","bao đóng"]
	},
	{
		topic: "__label__friend_class",
		key: ["friend class","lớp bạn"]
	},
	{
		topic: "__label__nested_class",
		key: ["nested class","lớp lồng"]
	},
	{
		topic: "__label__polymorphism",
		key: ["polymorphism","đa hình"]
	},
	{
		topic: "__label__abstraction",
		key: ["abstraction","ảo","trừu tượng"]
	},
	{
		topic: "__label__constructor",
		key: ["constructor","hàm tạo"]
	},
	{
		topic: "__label__inheritance",
		key: ["inheritance","kế thừa"]
	},
	{
		topic: "__label__base_class",
		key: ["base class","parent class","superclass","lớp cha","class cha"]
	},
	{
		topic: "__label__destructor",
		key: ["destructor","hàm hủy"]
	},
	{
		topic: "__label__structural",
		key: ["structural","structural pattern"]
	},
	{
		topic: "__label__attribute",
		key: ["attribute","thuộc tính"]
	},
	{
		topic: "__label__interface",
		key: ["interface","giao diện"]
	},
	{
		topic: "__label__overwrite",
		key: ["overwrite","ghi đè"]
	},
	{
		topic: "__label__prototype",
		key: ["prototype","prototype pattern"]
	},
	{
		topic: "__label__beginner",
		key: ["beginner","cơ bản"]
	},
	{
		topic: "__label__overload",
		key: ["overload","nạp chồng"]
	},
	{
		topic: "__label__strategy",
		key: ["strategy","strategy pattern"]
	},
	{
		topic: "__label__advance",
		key: ["nâng cao","advance"]
	},
	{
		topic: "__label__builder",
		key: ["builder","builder pattern"]
	},
	{
		topic: "__label__method",
		key: ["method","phương thức"]
	},
	{
		topic: "__label__object",
		key: ["object","đối tượng"]
	},
	{
		topic: "__label__field_def",
		key: ["field","trường"]
	},
	{
		topic: "__label__generic",
		key: ["generic"]
	},
	{
		topic: "__label__class",
		key: ["class","lớp"]
	},
] as ikeyword[]

export default keyword

interface ikeyword {
	topic: string
	key: string[]
}