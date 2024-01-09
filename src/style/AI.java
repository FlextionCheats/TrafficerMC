package rawfish2d.client.resolver3;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.IntBuffer;
import java.util.HashMap;

import org.lwjgl.opengl.GL11;

import rawfish2d.client.utils.DynamicTexture;
import rawfish2d.client.utils.MiscUtils;
import rawfish2d.client.utils.R2DUtils;
import rawfish2d.client.utils.TextureUtils;

public class AI {
	private static String fileName = "2515_2132157032.png";
	private static DynamicTexture tex = new DynamicTexture(128, 128);

	public static class ColorData {
		public int color;
		public int count;
	}

	public static void loadImage(String name) throws IOException {
		// if(AI.fileName.equalsIgnoreCase(name))
		// return;
		String maskPath = "C:/FILES/experements/JAVA/McHax 1.12 test/jars/Biboran/mask0.png";
		byte[] maskData = MiscUtils.extractBytes(maskPath);
		int[] maskIData = byteArrayToIntArray(maskData);

		fileName = name;
		String path = "C:/FILES/experements/JAVA/McHax 1.12 test/jars/Biboran/resolver/" + name;
		byte[] data = MiscUtils.extractBytes(path);
		int[] idata = byteArrayToIntArray(data);

		// color, count
		HashMap<String, ColorData> colorMap = new HashMap<String, ColorData>();

		for (Integer i : idata) {
			ColorData d = colorMap.get(i.toString());
			if (d == null) {
				d = new ColorData();
				d.color = i;
				d.count = 0;
				colorMap.put(i.toString(), d);
			} else {
				d.count += 1;
			}
		}

		int foregroundColor = 0;
		int minCount = 0;

		MiscUtils.sendChatClient("§aColor pallete is BGR.");
		MiscUtils.sendChatClient("§aFound §d" + colorMap.values().size() + "§a different colors.");
		for (ColorData d : colorMap.values()) {
			String hex = getHex(d.color);
			MiscUtils.sendChatClient("§aColor: §d" + hex + "§a count: §d" + d.count);

			if (!hex.equalsIgnoreCase("0xFFFFFFFF") && !hex.equalsIgnoreCase("0x00FFFFFF")) {
				if (d.count > minCount) {
					minCount = d.count;
					foregroundColor = d.color;
				}
			}
		}

		MiscUtils.sendChatClient("§cForeground color: §d" + getHex(foregroundColor) + "§c count: §d" + minCount);

		int[] newData = new int[idata.length];
		for (int a = 0; a < idata.length; ++a) {
			/*
			if(idata[a] == foregroundColor && maskIData[a] != 0xFFFFFF00) {
				idata[a] = 0xFF000000;
				newData[a] = idata[a];
			}
			else {
				newData[a] = 0x00FFFFFF;
			}
			*/

			// remove all except foreground
			/*
			if (idata[a] != foregroundColor) {
				idata[a] = 0xFFFFFFFF;
				newData[a] = idata[a];
			} else {
				idata[a] = 0x00000000;
				newData[a] = idata[a];
			}
			*/
			newData[a] = idata[a];
		}
		tex.updateTexture(newData);

		/*
		for(int a = 0; a < idata.length; ++a) {
			if(idata[a] == foregroundColor && maskIData[a] != 0xFFFFFF00) {
				idata[a] = 0xFF000000;
			}
			else {
			}
		}
		tex.updateTexture(idata);
		*/
	}

	public static String getHex(int value) {
		String hex0 = Integer.toHexString(value).toUpperCase();
		while (hex0.length() < 8) {
			hex0 = "0" + hex0;
		}
		String hex = "0x" + hex0;
		return hex;
	}

	  public static void render(float x, float y) {
		    //GL11.glBindTexture(3553, tex.getTextureID());
		    GL11.glColor4f(1.0F, 1.0F, 1.0F, 1.0F);
		    x /= 2.0F;
		    y /= 2.0F;
		    //TextureUtils.renderTexture(x, y, 128.0F, 128.0F);
		    R2DUtils.drawBorderedRect2(x, y, x + 128.0F, y + 128.0F, 1.0F, -16711936, 0);
		    R2DUtils.bindDefaultFontTexture();
		    R2DUtils.drawStringWithShadow("2515_2132157032.png", (int)x, ((int)y - 12), -16711936);
		    String path = "Biboran/mask0.png";
		    GL11.glColor4f(1.0F, 1.0F, 1.0F, 1.0F);
		  }

	public static int[] byteArrayToIntArray(byte[] data) {
		if (data == null)
			return null;

		IntBuffer intBuf = ByteBuffer.wrap(data).order(ByteOrder.BIG_ENDIAN).asIntBuffer();
		int[] arr = new int[intBuf.remaining()];
		intBuf.get(arr);

		return arr;
	}
}
