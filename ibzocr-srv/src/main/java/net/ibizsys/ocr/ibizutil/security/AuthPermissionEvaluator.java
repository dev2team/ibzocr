package net.ibizsys.ocr.ibizutil.security;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import net.ibizsys.ocr.ibizutil.SpringContextHolder;
import net.ibizsys.ocr.ibizutil.annotation.PreField;
import net.ibizsys.ocr.ibizutil.domain.EntityBase;
import net.ibizsys.ocr.ibizutil.enums.PredefinedType;
import net.ibizsys.ocr.ibizutil.errors.BadRequestAlertException;
import net.ibizsys.ocr.ibizutil.service.SearchFilterBase;
import net.ibizsys.ocr.ibizutil.service.ServiceImplBase;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * spring security 权限管理类
 * 重写权限控制方法
 */
@Component
public class AuthPermissionEvaluator implements PermissionEvaluator {

    @Value("${ibiz.enablePermissionValid:false}")
    boolean enablePermissionValid;  //是否开启权限校验
    /**
     * 表格权限控制
     * @param authentication
     * @param type
     * @param
     * @return
     */
    @Override
    public boolean hasPermission(Authentication authentication, Object type, Object objPermissionList) {

        if(AuthenticationUser.getAuthenticationUser().getSuperuser()==1  || !enablePermissionValid)
            return true;  //系统没开启权限、超级管理员 两种情况不进行权限检查

        try{
            List ArrayPermissionList=new ArrayList();
            if(ArrayPermissionList instanceof ArrayList)
                ArrayPermissionList = (ArrayList) objPermissionList;
            String entityName;//准备参数
            String dataset = null;
            String targetType;
            EntityBase entityBase;
            Map removeData=new HashMap();
            Object searchfilter = null;
            if(ArrayPermissionList.size()==4){
                entityName=ArrayPermissionList.get(0).toString();
                targetType=ArrayPermissionList.get(1).toString();
                entityBase= (EntityBase) ArrayPermissionList.get(2);
                removeData= (Map) ArrayPermissionList.get(3);
            }
            else if(ArrayPermissionList.size()==5){
                entityName=ArrayPermissionList.get(0).toString();
                dataset=ArrayPermissionList.get(1).toString();
                targetType=ArrayPermissionList.get(2).toString();
                entityBase= (EntityBase) ArrayPermissionList.get(3);
                searchfilter=ArrayPermissionList.get(4);
            }
            else
                return false;
            if(targetType.equals("DELETE")){    //表格删除权限校验
                ServiceImplBase service= SpringContextHolder.getBean(String.format("%s%s",entityName,"ServiceImpl"));//获取当前实体service
                String removeDataArr[]=parseRemoveDataToArr(removeData);
                JSONObject permissionList= AuthenticationUser.getAuthenticationUser().getPermisionList();//获取权限列表
                JSONObject formDataAbility=permissionList.getJSONObject("dataAbility-form");//获取表单的权限数据
                Map<String,String> permissionField=getPermissionField(entityBase);
                String selectCond=generatePermissionSQLGridRemove(formDataAbility,entityName,targetType,permissionField,removeDataArr);//拼接权限条件
                if(StringUtils.isEmpty(selectCond))
                    return false;
                QueryWrapper permissionCond=getPermissionCond(selectCond,permissionField);
                return testDataAccess_GridRemove(service,permissionCond,removeDataArr);//执行权限检查
            }
            else{   //表格查询权限校验
                if(StringUtils.isEmpty(entityName)|| StringUtils.isEmpty(dataset)||StringUtils.isEmpty(targetType))
                    return false;
                JSONObject permissionList= AuthenticationUser.getAuthenticationUser().getPermisionList();//获取权限列表
                JSONObject grideDataAbility=permissionList.getJSONObject("dataAbility-grid");//获取表格的权限数据
                Map<String,String> permissionField=getPermissionField(entityBase);
                String selectCond=generatePermissionSQLGrid(grideDataAbility,entityName,targetType,dataset,permissionField);//拼接权限条件
                if(StringUtils.isEmpty(selectCond))
                    return false;
                QueryWrapper permissionCond=getPermissionCond(selectCond,permissionField);//拼接 inner join 条件
                filterDataAccess(searchfilter,permissionCond);//执行权限检查
            }
                return true;
        }catch (Exception e){
            throw new BadRequestAlertException("系统在进行权限检查时出现异常，原因为:"+e, "", "");
        }
    }

    /**
     * 表单权限校验
     * @param authentication
     * @param targetId   数据主键
     * @param targetType  权限校验类型：insert,update,delete,read;
     * @param
     * @return
     */
    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object objPermissionList) {

        if(AuthenticationUser.getAuthenticationUser().getSuperuser()==1  || !enablePermissionValid)
            return true;  //系统没开启权限、超级管理员 两种情况不进行权限检查

        boolean isPermission=false;
        List ArrayPermissionList=new ArrayList();
        if(ArrayPermissionList instanceof ArrayList)
            ArrayPermissionList = (ArrayList) objPermissionList;
        try {
            if(ArrayPermissionList.size()!=3)
                return false;
            String entityName=ArrayPermissionList.get(0).toString(); //实体名
            String operator=ArrayPermissionList.get(1).toString();  //实体行为
            EntityBase entityBase= (EntityBase) ArrayPermissionList.get(2);//实体类
            if(StringUtils.isEmpty(entityName)|| StringUtils.isEmpty(operator))
                return false;
            if(operator.equals("CREATE")){  //表单新建权限校验
                JSONObject permissionList= AuthenticationUser.getAuthenticationUser().getPermisionList();//获取权限列表
                JSONObject formDataAbility=permissionList.getJSONObject("dataAbility-form");//获取表单的权限数据
                return isFormCreatePermission(formDataAbility,entityName,operator);//拼接权限条件
            }
            else{ //表单编辑、查询权限校验
                ServiceImplBase service= SpringContextHolder.getBean(String.format("%s%s",entityName,"ServiceImpl"));//获取当前实体service
                JSONObject permissionList= AuthenticationUser.getAuthenticationUser().getPermisionList();//获取权限列表
                JSONObject formDataAbility=permissionList.getJSONObject("dataAbility-form");//获取表单的权限数据
                Map<String,String> permissionField=getPermissionField(entityBase);
                String selectCond=generatePermissionSQLForm(formDataAbility,entityName,operator,targetId,permissionField);//拼接权限条件
                if(StringUtils.isEmpty(selectCond))
                    return false;
                QueryWrapper permissionCond=getPermissionCond(selectCond,permissionField);
                isPermission=testDataAccess(service,permissionCond);//执行权限检查
            }
        }catch (Exception e){
            throw new BadRequestAlertException("系统在进行权限检查时出现异常，原因为:"+e, "", "");
        }
                return isPermission;
    }

    /**
     * 拼接表格查询条件
     * @param gridDataAbility
     * @param entityName
     * @param targetType
     * @param dedatasetType
     * @param permissionField
     * @return
     */
    private String  generatePermissionSQLGrid(JSONObject gridDataAbility,String entityName,String targetType,String dedatasetType,Map<String,String> permissionField){
        if(gridDataAbility==null)
            return null;
        if(!gridDataAbility.containsKey(entityName))
            return null;
        JSONObject entityObj=gridDataAbility.getJSONObject(entityName);//获取实体
        if(!entityObj.containsKey(dedatasetType))
            return null;
        JSONObject  dedatasetObject=entityObj.getJSONObject(dedatasetType);//获取实体数据集
        if(!dedatasetObject.containsKey(targetType))
            return null;
        JSONArray entityOperation=dedatasetObject.getJSONArray(targetType);//行为：read；insert...
        if(entityOperation.size()==0)
            return null;
        String resultCond=getPermissionCond(entityOperation,permissionField);
        return resultCond;
    }

    /**
     * 表格拼接权限条件，过滤出权限数据
     * @param targetDomainObject
     * @param permissionCond
     * @throws Exception
     */
    private void filterDataAccess(Object targetDomainObject,QueryWrapper permissionCond) throws Exception{
        if(targetDomainObject instanceof SearchFilterBase){
            Method permissionCondMethod = targetDomainObject.getClass().getMethod("setPermissionCond",QueryWrapper.class);
            permissionCondMethod.invoke(targetDomainObject, permissionCond);
        }
    }

    /**
     * 拼接表格删除条件
     * @param formDataAbility
     * @param entityName
     * @param targetType
     * @param permissionField
     * @param removeDataArr
     * @return
     */
    private String generatePermissionSQLGridRemove(JSONObject formDataAbility,String entityName,String targetType,Map<String,String> permissionField,String[] removeDataArr){
        if(formDataAbility==null)
            return null;
        if(!formDataAbility.containsKey(entityName))
            return null;
        JSONObject entityObj=formDataAbility.getJSONObject(entityName);//获取实体
        if(!entityObj.containsKey(targetType))
            return null;
        JSONArray entityOperation=entityObj.getJSONArray(targetType);//行为：read；insert...
        if(entityOperation.size()==0)
            return null;
        String removeCond=getGridRemoveCond(removeDataArr);
        String resultCond=getPermissionCond(entityOperation,permissionField);
        return String.format(" (%s) AND (%sid in (%s) )",resultCond,entityName.toLowerCase(),removeCond); //拼接权限条件-编辑
    }

    /**
     * 表格删除权限检查
     * @param service
     * @param permissionCond
     * @param removeDataArr
     * @return
     */
    private boolean testDataAccess_GridRemove(ServiceImplBase service,QueryWrapper permissionCond,String removeDataArr[]){
        boolean isPermission=false;
        Page<T> list=service.selectPermission(permissionCond);
        if(list.getTotal()==removeDataArr.length)//将用户要删除的数据进行权限过滤，过滤后的size如果与删除的size相等，则证明要删除的数据都是权限内的数据
            isPermission=true;
        return isPermission;
    }

    /**
     * 拼接表单数据查询条件
     * @param formDataAbility
     * @param entityName
     * @param targetType
     * @param targetId
     * @param permissionField
     * @return
     */
    private String generatePermissionSQLForm(JSONObject formDataAbility,String entityName,String targetType,Serializable targetId,Map<String,String> permissionField){
            if(formDataAbility==null)
                return null;
            if(!formDataAbility.containsKey(entityName))
                return null;
            JSONObject entityObj=formDataAbility.getJSONObject(entityName);//获取实体
            if(!entityObj.containsKey(targetType))
                return null;
            JSONArray entityOperation=entityObj.getJSONArray(targetType);//行为：read；insert...
            if(entityOperation.size()==0)
                return null;
            String resultCond=getPermissionCond(entityOperation,permissionField);
            if(StringUtils.isEmpty(targetId))
                return String.format(" (%s)",resultCond,entityName.toLowerCase()); //拼接权限条件-新建
            else
                return String.format(" (%s) AND (%sid='%s')",resultCond,entityName.toLowerCase(),targetId); //拼接权限条件-编辑
    }


    /**
     * 判断当前用户是否拥有建立表单数据权限
     * @param formDataAbility
     * @param entityName
     * @param targetType
     * @return
     */
    private boolean isFormCreatePermission(JSONObject formDataAbility,String entityName,String targetType){
        if(formDataAbility==null)
            return false;
        if(!formDataAbility.containsKey(entityName))
            return false;
        JSONObject entityObj=formDataAbility.getJSONObject(entityName);//获取实体
        if(!entityObj.containsKey(targetType))
            return false;
        return true;
    }

    /**
     * 表单权限检查
     * @param service
     * @param permissionCond
     * @return
     */
    private boolean testDataAccess(ServiceImplBase service,QueryWrapper permissionCond){
         boolean isPermission=false;
             Page<T> list=service.selectPermission(permissionCond);
             if(list.getTotal()>0)
                 isPermission=true;
        return isPermission;
    }


    /**
     * 拼接权限条件（表单/表格）共用
     * @param entityOperation
     * @param permissionField
     * @return
     */
    private String  getPermissionCond(JSONArray entityOperation,Map<String,String> permissionField){
        String orgField=permissionField.get("orgfield");
        String orgsecfield=permissionField.get("orgsecfield");
        StringBuffer cond=new StringBuffer();
        for(int i=0;i<entityOperation.size();i++){
            if(i>0 && (!StringUtils.isEmpty(cond.toString())))
                cond.append("OR");
            String permissionCond=entityOperation.getString(i);//权限配置条件
            if(permissionCond.equals("CUR_ORG")){   //本单位
                cond.append(String.format("(t1.%s='%s')",orgField,AuthenticationUser.getAuthenticationUser().getOrgid()));
            }
            if(permissionCond.equals("SUB_ORG")){//下级单位
                cond.append(" INSTR(j1.LEVELCODE,'"+AuthenticationUser.getAuthenticationUser().getLevelcode()+"')=1 ");
            }
            if(permissionCond.equals("HIT_ORG")){//上级单位
                cond.append(" INSTR('"+AuthenticationUser.getAuthenticationUser().getLevelcode()+"',j1.LEVELCODE)=1 ");
            }
            if(permissionCond.equals("CREATEMAN")){//建立人
                cond.append(String.format("(t1.createman='%s')",AuthenticationUser.getAuthenticationUser().getUserid()));
            }
//            if(permissionCond.equals("CUR_ORGSEC")){//本部门
//                cond.append(String.format("(t1.orgsecid='%s')",AuthenticationUser.getAuthenticationUser().getMdeptid()));
//            }
//            if(permissionCond.equals("SUB_ORGSEC")){//下级部门
//                cond.append(" INSTR(j2.LEVELCODE,'"+AuthenticationUser.getAuthenticationUser().getMdeptcode()+"')=1 ");
//            }
//            if(permissionCond.equals("HIGH_ORGSEC")){//上级部门
//                cond.append(" INSTR('"+AuthenticationUser.getAuthenticationUser().getMdeptcode()+"',j2.LEVELCODE)=1 ");
//            }
            if(permissionCond.equals("TOTAL")){//全部数据
                cond.append("(1=1)");
            }
        }
        if(StringUtils.isEmpty(cond.toString()))
            return "";

        String resultCond=cond.toString();
        if(resultCond.endsWith("OR")){
            resultCond=resultCond.substring(0,resultCond.lastIndexOf("OR"));
        }
        return  resultCond;
    }

    /**
     * 拼接权限查询条件(表单/表格)共用
     * @param whereCond
     * @param permissionField
     * @return
     */
    private QueryWrapper getPermissionCond(String whereCond,Map<String,String> permissionField){
        QueryWrapper allPermissionCond=new QueryWrapper();
        //permissionCond.apply("inner join JC_ORG j1 on t1.ORGID=j1.orgid inner join JC_ORGSEC j2 on t1.orgsecid=j2.orgsecid");

        if(StringUtils.isEmpty(whereCond))
            return allPermissionCond;

        String strAllPermissionCond=String.format("inner join XT_ZZJG_DWBM j1 on t1.%s=j1.dwbm where (%s) ",permissionField.get("orgfield"),whereCond);

        allPermissionCond.apply(strAllPermissionCond);

        return allPermissionCond;
    }

    /**
     * 获取实体权限字段 orgid/orgsecid
     * @param entityBase
     * @return
     */
    private Map<String,String> getPermissionField(EntityBase entityBase){
        Map<String,String> permissionFiled=new HashMap<>();
        String orgField="orgid";  //组织权限默认值
        String orgsecField="orgsecid"; //部门权限默认值
        Map<Field, PreField> preFields= entityBase.SearchPreField(); //从缓存中获取当前类预置属性
        //寻找实体权限属性
        for (Map.Entry<Field,PreField> entry : preFields.entrySet()){
            Field prefield=entry.getKey();//获取注解字段
            PreField fieldAnnotation=entry.getValue();//获取注解值
            PredefinedType prefieldType=fieldAnnotation.preType();
            if(prefieldType==PredefinedType.ORGID)//用户配置系统预置属性-组织机构标识
                orgField=prefield.getName();
            if(prefieldType==PredefinedType.ORGSECTORID)//用户配置系统预置属性-部门标识
                orgsecField=prefield.getName();
        }
        permissionFiled.put("orgfield",orgField);
        permissionFiled.put("orgsecfield",orgsecField);
        return permissionFiled;
    }

    /**
     * Map转StringArr
     * @param removeData
     * @return
     */
    private String[] parseRemoveDataToArr(Map removeData) {
        String srfkeyArr[]=null;
        StringBuffer result = new StringBuffer();
        if(!StringUtils.isEmpty(removeData.get("srfkeys"))){
            String srfkeys=removeData.get("srfkeys").toString();
            srfkeyArr =srfkeys.split(";");
        }
        return srfkeyArr;
    }

    /**
     * 拼接删除数据条件
     * @param removeDataArr
     * @return
     */
    private String getGridRemoveCond(String[] removeDataArr) {
        StringBuffer result = new StringBuffer();
        for(int a=0;a<removeDataArr.length;a++){
            result.append(String.format("'%s'",removeDataArr[a]));
            if(a!=removeDataArr.length-1)
                result.append(",");
        }
        return result.toString();
    }
}