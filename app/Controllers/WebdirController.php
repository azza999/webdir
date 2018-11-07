<?php 

class WebdirController
{
	public function main()
	{
		include __DIR__.'/../Views/webdir.php';
	}
	public function getDirInner()
	{
		$dir = $_POST['dir'];
		$inners = scandir($dir);
		$infos = $folders = $files = [];
		foreach ($inners as $idx => $inner) {
			if (
				$inner == '.' ||
				$inner == '.git'
			) continue;
			$path = $dir.'/'.$inner;
			if (is_dir($path)) {
				$folders[] = pathinfo($path);
			}
			if (is_file($path)) {
				$files[] = pathinfo($path);
			}
		}
		$html = '';
		foreach ($folders as $idx => $folder) {
			if ($folder['basename'] == '..') {
				$uppath = implode('/',array_slice(explode("/", $folder['dirname']),0,-1));
				$html .= '<label class="dir-item" data-type="folder" data-target="'.$uppath.'">';
			} else {
				$html .= '<label class="dir-item" data-type="folder" data-target="'.$folder['dirname'].'/'.$folder['basename'].'">';
			}
			$html .= '
					<input type="checkbox" data-idx="0" class="dir-item-checkbox" hidden="">
					<span class="dir-item-inner">
						<span class="dir-item-icon"><i class="fas fa-folder fa-10x"></i></span>
						<span class="dir-item-name">'.strfix($folder['basename'],11).'</span>
						<span class="dir-item-modiDate">'.date('Y-m-d',filectime($folder['dirname'].'/'.$folder['basename'])).'</span>
					</span>
				</label>
			';
		}
		$extensions = array(
			'css' => 'fab fa-css3',
			'html' => 'fab fa-html',
			'php' => 'fab fa-php',
			'markdown' => 'fab fa-markdown',
			'js' => 'fab fa-js-square'
		);
		foreach ($files as $idx => $file) {
			$extension = $extensions[$file['extension'] ?? ''] ?? 'fas fa-file';
			$html .= '
				<label class="dir-item" data-type="file" data-target="'.$file['dirname'].'/'.$file['basename'].'" data-name="'.$file['basename'].'">
					<input type="checkbox" data-idx="0" class="dir-item-checkbox" hidden="">
					<span class="dir-item-inner">
						<span class="dir-item-icon"><i class="'.$extension.' fa-10x"></i></span>
						<span class="dir-item-name">'.strfix($file['basename'],11).'</span>
						<span class="dir-item-modiDate">'.date('Y-m-d',filectime($file['dirname'].'/'.$file['basename'])).'</span>
					</span>
				</label>
			';
		}
		echo $html;
	}
	public function openFile()
	{
		$dir = $_POST['dir'];
		echo file_get_contents($dir);
	}
	public function saveFile()
	{
		$dir = $_POST['dir'];
		$content = $_POST['content'];
		file_put_contents($dir, $content);
	}
	/*public function download($url,$name)
	{
		implode(explode($url, "%4"), "/");
		header("Pragma: public");
		header("Expires: 0");
		header("Content-Type: application/octet-stream");
		header("Content-Disposition: attachment; filename=".$name);
		header("Content-Transfer-Encoding: binary");
		header("ContentLength:".filesize($dir));
		readfile($dir);
	}*/
}