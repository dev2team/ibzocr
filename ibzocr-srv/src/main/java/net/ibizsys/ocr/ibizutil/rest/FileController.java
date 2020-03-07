package net.ibizsys.ocr.ibizutil.rest;

import net.ibizsys.ocr.ibizutil.domain.FileItem;
import net.ibizsys.ocr.ibizutil.domain.IBZFILE;
import net.ibizsys.ocr.ibizutil.errors.InternalServerErrorException;
import net.ibizsys.ocr.ibizutil.service.IBZFILEService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.UUID;


@RestController
@RequestMapping("/")
public class FileController
{

	@Value("${ibiz.filePath:/app/file/}")
	private String FILEPATH;

    @Value("${ibiz.userfiletable:false}")
	private boolean userfiletable;

	@Autowired
	private IBZFILEService ibzfileService;

	@PostMapping(value = "${ibiz.uploadpath.path:ibizutil/upload}")
	public ResponseEntity<FileItem> upload(@RequestParam("file") MultipartFile multipartFile){
		FileItem item=null;
		// 获取文件名
		String fileName = multipartFile.getOriginalFilename();
		// 获取文件后缀
		String extname="."+getExtensionName(fileName);
		// 用uuid作为文件名，防止生成的临时文件重复
		String fileid= UUID.randomUUID().toString();
		File file = null;
		try {
			String filepath;
			if(userfiletable) {
				SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
				filepath=dateFormat.format(new java.util.Date())+ File.separator+fileid+ File.separator;
				IBZFILE ibzfile=new IBZFILE();
				ibzfile.setFileid(fileid);
				ibzfile.setFilename(fileName);
				ibzfile.setFileext(extname);
				ibzfile.setFilesize((int)multipartFile.getSize());
				ibzfile.setFilepath(filepath+fileName);
				ibzfileService.save(ibzfile);
			}
			else
				filepath="ibizutil"+ File.separator+fileid+ File.separator;
			String dirpath=FILEPATH+filepath;
			File dir=new File(dirpath);
			if(!dir.exists())
				dir.mkdirs();
			file = new File(dir,fileName);
			FileCopyUtils.copy(multipartFile.getInputStream(), Files.newOutputStream(file.toPath()));
			item=new FileItem(fileid,fileName,file.length(),extname);
		} catch (IOException e) {
			throw new InternalServerErrorException("文件上传失败");
		}
		return ResponseEntity.ok().body(item);
	}

	private File getFile(String id){
		File file= null;
		if(userfiletable){
			IBZFILE ibzfile=ibzfileService.getById(id);
			if(ibzfile==null)
				throw new InternalServerErrorException("获取文件失败");
			String filepath=ibzfile.getFilepath();
			filepath=filepath.replace("\\",File.separator);
			filepath=filepath.replace("/",File.separator);
			file=new File(FILEPATH+filepath);
			if(!file.exists())
				throw new InternalServerErrorException("获取文件失败");
		}
		else {
			String dirpath = FILEPATH + "ibizutil" + File.separator + id + File.separator;
			File dir = new File(dirpath);
			if (!dir.exists())
				throw new InternalServerErrorException("获取文件失败");
			File[] files = dir.listFiles();
			if (files.length == 0)
				throw new InternalServerErrorException("获取文件失败");
			file = files[0];
		}
		return file;
	}

	private final String defaultdownloadpath="ibizutil/download/{id}";
	@GetMapping(value = "${ibiz.file.downloadpath:"+defaultdownloadpath+"}")
	@ResponseStatus(HttpStatus.OK)
	public void download(@PathVariable String id, HttpServletResponse response){
        File file= getFile(id);
		String fileName=file.getName();
		try {
			fileName=new String(fileName.getBytes("utf-8"),"iso8859-1");//防止中文乱码
		}
		catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		response.setHeader("Content-Disposition", "attachment;filename="+fileName);
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		try {
			bis = new BufferedInputStream(new FileInputStream(file));
			bos = new BufferedOutputStream(response.getOutputStream());
			byte[] buff = new byte[2048];
			int bytesRead;
			while (-1 != (bytesRead = bis.read(buff, 0, buff.length))) {
				bos.write(buff, 0, bytesRead);
			}
		}
		catch (Exception e) {
			//throw e;
		}
		finally {
			if (bis != null) {
				try {
					bis.close();
				}
				catch (IOException e) {

				}
			}
			if (bos != null) {
				try {
					bos.close();
				}
				catch (IOException e) {

				}
			}
		}
	}


	/**
	 * 定义GB的计算常量
	 */
	private static final int GB = 1024 * 1024 * 1024;
	/**
	 * 定义MB的计算常量
	 */
	private static final int MB = 1024 * 1024;
	/**
	 * 定义KB的计算常量
	 */
	private static final int KB = 1024;

	/**
	 * 格式化小数
	 */
	private static final DecimalFormat DF = new DecimalFormat("0.00");


	/**
	 * 删除
	 * @param files
	 */
	public static void deleteFile(File... files) {
		for (File file : files) {
			if (file.exists()) {
				file.delete();
			}
		}
	}

	/**
	 * 获取文件扩展名
	 * @param filename
	 * @return
	 */
	public static String getExtensionName(String filename) {
		if ((filename != null) && (filename.length() > 0)) {
			int dot = filename.lastIndexOf('.');
			if ((dot >-1) && (dot < (filename.length() - 1))) {
				return filename.substring(dot + 1);
			}
		}
		return filename;
	}

	/**
	 * Java文件操作 获取不带扩展名的文件名
	 * @param filename
	 * @return
	 */
	public static String getFileNameNoEx(String filename) {

		if ((filename != null) && (filename.length() > 0)) {
			int dot = filename.lastIndexOf('.');
			if ((dot >-1) && (dot < (filename.length()))) {
				return filename.substring(0, dot);
			}
		}
		return filename;
	}

	/**
	 * 文件大小转换
	 * @param size
	 * @return
	 */
	public static String getSize(int size){
		String resultSize = "";
		if (size / GB >= 1) {
			//如果当前Byte的值大于等于1GB
			resultSize = DF.format(size / (float) GB) + "GB   ";
		} else if (size / MB >= 1) {
			//如果当前Byte的值大于等于1MB
			resultSize = DF.format(size / (float) MB) + "MB   ";
		} else if (size / KB >= 1) {
			//如果当前Byte的值大于等于1KB
			resultSize = DF.format(size / (float) KB) + "KB   ";
		} else {
			resultSize = size + "B   ";
		}
		return resultSize;
	}

}