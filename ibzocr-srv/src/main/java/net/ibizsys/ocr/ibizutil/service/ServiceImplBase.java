package net.ibizsys.ocr.ibizutil.service;

import java.io.Serializable;
import java.util.Objects;
import org.springframework.cglib.beans.BeanMap;
import org.springframework.transaction.annotation.Transactional;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.TableInfo;
import com.baomidou.mybatisplus.core.toolkit.ExceptionUtils;
import com.baomidou.mybatisplus.core.toolkit.ReflectionKit;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.core.toolkit.TableInfoHelper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import net.ibizsys.ocr.ibizutil.enums.FillMode;
import net.ibizsys.ocr.ibizutil.enums.PredefinedType;
import java.util.Map;
import net.ibizsys.ocr.ibizutil.security.AuthenticationUser;
import java.lang.reflect.Field;
import net.ibizsys.ocr.ibizutil.annotation.PreField;
import java.sql.Timestamp;
import java.util.Date;
import org.springframework.cglib.beans.BeanCopier;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;


public abstract class ServiceImplBase<M extends BaseMapper<T>, T> extends ServiceImpl<M, T> {

	protected abstract Object getEntityKey(T et) ;

    public boolean checkKey(T et)  {
		if (null != et) {
		Class<?> cls = et.getClass();
		TableInfo tableInfo = TableInfoHelper.getTableInfo(cls);
		if (null != tableInfo && StringUtils.isNotEmpty(tableInfo.getKeyProperty())) {
			Object idVal = ReflectionKit.getMethodValue(cls, et, tableInfo.getKeyProperty());
			return StringUtils.checkValNull(idVal) || Objects.isNull(getById((Serializable) idVal)) ? false: true;
		}
		else {
			return false;
			}
		}
			return false;
    }

	public T get(T et)  {
		T result = this.getById((Serializable) getEntityKey(et));
		if(result!=null){
			BeanCopier copier=BeanCopier.create(result.getClass(),et.getClass(), false);
			copier.copy(result,et,null);
		}
		return et;
	}

	public boolean getDraft(T et)  {
		return false;
	}

	public boolean create(T et) {
		boolean bRt=retBool(baseMapper.insert(et));
		this.get(et);
		return bRt;
	}

	public boolean update(T et) {
		return false;
	}

	public boolean remove(T et)  {
		return this.removeById((Serializable) getEntityKey(et));
	}

	@Transactional(rollbackFor = Exception.class)
	@Override
	public boolean save(T entity) {
		return this.saveOrUpdate(entity);
	}

	@Transactional(rollbackFor = Exception.class)
	@Override
	public boolean saveOrUpdate(T entity) {
		if (null != entity) {
			Class<?> cls = entity.getClass();
			TableInfo tableInfo = TableInfoHelper.getTableInfo(cls);
			if (null != tableInfo && StringUtils.isNotEmpty(tableInfo.getKeyProperty())) {
				Object idVal = ReflectionKit.getMethodValue(cls, entity, tableInfo.getKeyProperty());
				return StringUtils.checkValNull(idVal) || Objects.isNull(getById((Serializable) idVal)) ? create(entity): update(entity);
			} else {
				throw ExceptionUtils.mpe("Error:  Can not execute. Could not find @TableId.");
			}
		}
		return false;
	}

	public T getTemp(T et)  {
        T result = this.getById((Serializable) getEntityKey(et));
        if(result!=null){
        BeanCopier copier=BeanCopier.create(result.getClass(),et.getClass(), false);
            copier.copy(result,et,null);
        }
        return et;
	}

	public boolean getDraftTemp(T et)  {
		return false;
	}

	public boolean createTemp(T et)  {
        boolean bRt=retBool(baseMapper.insert(et));
        this.get(et);
        return bRt;
	}

	public boolean removeTemp(T et)  {
		return this.removeById((Serializable) getEntityKey(et));
	}

	public boolean updateTemp(T et)  {
		return this.updateById(et);
	}

	public boolean getTempMajor(T et)  {
        return false;
	}

	public boolean getDraftTempMajor(T et)  {
		return false;
	}

	public boolean createTempMajor(T et)  {
		return this.saveOrUpdate(et);
		 
	}

	public boolean removeTempMajor(T et)  {
		return this.removeById((Serializable) getEntityKey(et));
	}

	public boolean updateTempMajor(T et)  {
		return this.updateById(et);
	}

    protected void beforeCreate(T et){

    }

    protected void beforeUpdate(T et){

	}
    public Page<T> selectPermission(QueryWrapper<T> selectCond){
        return null;
	}
}