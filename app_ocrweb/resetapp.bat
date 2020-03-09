!!!!模版产生代码错误:----
Tip: It's the step after the last dot that caused this error, not those before it.
----
Tip: If the failing expression is known to be legally refer to something that's sometimes null or missing, either specify a default value like myOptionalVar!myDefault, or use <#if myOptionalVar??>when-present<#else>when-missing</#if>. (These only cover the last step of the expression; to cover the whole expression, use parenthesis: (myOptionalVar.foo)!myDefault, (myOptionalVar.foo)??
----

----
FTL stack trace ("~" means nesting-related):
	- Failed at: #if publisher.getContext().isRebuildM...  [in template "TEMPLCODE_zh_CN" at line 5, column 1]
----