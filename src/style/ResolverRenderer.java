package rawfish2d.client.resolver3;

import java.awt.image.BufferedImage;
import java.nio.IntBuffer;

import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GL12;

import net.minecraft.block.material.MapColor;
import net.minecraft.client.renderer.GLAllocation;
import net.minecraft.client.renderer.GlStateManager;
import net.minecraft.network.play.server.SPacketMaps;
import net.minecraft.world.storage.MapData;
import rawfish2d.client.utils.TextureUtils;

public class ResolverRenderer {
	// from 1.5.2 RenderEngine
	public static final ResolverRenderer instance = new ResolverRenderer();
	public int boundTexture = 0;
	public IntBuffer imageData = GLAllocation.createDirectIntBuffer(4194304);

	public int textureID = 0;
	public int[] intArray = null;

	private ResolverRenderer() {
	}

	public static ResolverRenderer get() {
		return instance;
	}

	public void setMap(SPacketMaps pmaps) {
		if (pmaps == null) {
			return;
		}

		setMap(pmaps.getMapDataBytes());
	}

	public void setMap(byte[] data) {
		if (data == null) {
			return;
		}
		newMap();

		intArray = getMapData(data);
	}

	public static int[] getMapData(SPacketMaps pmaps) {
		return getMapData(pmaps.getMapDataBytes());
	}

	public static int[] getMapData(MapData mapData) {
		return getMapData(mapData.colors);
	}

	  public static int[] getMapData(byte[] data) {
		    if (data == null)
		      return null; 
		    int[] arr = new int[data.length];
		    int[] colors = new int[arr.length];
		    int a;
		    for (a = 0; a < 128; a++) {
		      for (int b = 0; b < 128; b++)
		        colors[a + b * 128] = data[a + b * 128]; 
		    } 
		    for (a = 0; a < 16384; a++) {
		      int index = colors[a] & 0xFF;
		      if (index / 4 == 0) {
		        arr[a] = (a + a / 128 & 0x1) * 8 + 16 << 24;
		      } else {
		        arr[a] = MapColor.COLORS[index / 4].getMapColor(index & 0x3);
		      } 
		      arr[a] = arr[a] | 0xFF000000;
		    } 
		    return arr;
		  }

	private void newMap() {
		initRender(128, 128);
	}

	public void initRender(int width, int height) {
		if (textureID != 0) {
			GlStateManager.deleteTexture(textureID);
		}

		textureID = allocateAndSetupTexture(new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB));
		intArray = new int[width * height];
		for (int var4 = 0; var4 < intArray.length; ++var4) {
			intArray[var4] = 0;
		}
	}

	public void renderMap(int x2, int y2, int widthTexture, int heightTexture, int width, int height) {
		if (intArray == null) {
			return;
		}

		createTextureFromBytes(intArray, widthTexture, heightTexture, textureID);
		GlStateManager.bindTexture(textureID);
		GlStateManager.disableDepth();
		GlStateManager.enableBlend();
		GlStateManager.enableTexture2D();
		GlStateManager.blendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);

		GL11.glHint(GL11.GL_POLYGON_SMOOTH_HINT, GL11.GL_NICEST);
		GL11.glColor4f(1.0f, 1.0f, 1.0f, 1.0f);

		TextureUtils.renderTexture(x2, y2, width, height);

		GlStateManager.disableBlend();
		GlStateManager.enableDepth();
		GlStateManager.disableTexture2D();
		// GL11.glPushMatrix();
		// GL11.glTranslatef((float) 0.0f, (float) 0.0f, (float) -0.04f);
		// GL11.glScalef((float) 1.0f, (float) 1.0f, (float) 1.0f);
		// GL11.glPopMatrix();
	}


	// from 1.5.2 RenderEngine
	private void createTextureFromBytes(int[] par1ArrayOfInteger, int par2, int par3, int par4) {
		GL11.glBindTexture(GL11.GL_TEXTURE_2D, par4);
		GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MIN_FILTER, GL11.GL_NEAREST);
		GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MAG_FILTER, GL11.GL_NEAREST);
		GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_S, GL11.GL_REPEAT);
		GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_T, GL11.GL_REPEAT);

		checkImageDataSize(par1ArrayOfInteger.length);
		imageData.clear();
		imageData.put(par1ArrayOfInteger);
		imageData.position(0).limit(par1ArrayOfInteger.length);
		GL11.glTexSubImage2D(GL11.GL_TEXTURE_2D, 0, 0, 0, par2, par3, GL12.GL_BGRA, GL12.GL_UNSIGNED_INT_8_8_8_8_REV, imageData);
	}

	// from 1.5.2 RenderEngine
	private void checkImageDataSize(int size) {
		if (imageData == null || imageData.capacity() < size) {
			size = ceilPowerOfTwo(size);
			imageData = GLAllocation.createDirectIntBuffer(size);
		}
	}

	// from 1.5.2 GLAllocation
	private int generateTextureNames() {
		return GlStateManager.generateTexture();
	}

	// from 1.5.2 RenderEngine
	private int allocateAndSetupTexture(BufferedImage par1BufferedImage) {
		int texID = generateTextureNames();
		setupTexture(par1BufferedImage, texID);
		return texID;
	}

	// from 1.5.2 RenderEngine
	private void setupTexture(BufferedImage par1BufferedImage, int texID) {
		setupTextureExt(par1BufferedImage, texID, false, false);
	}

	// from 1.5.2 RenderEngine
	private void setupTextureExt(BufferedImage par1BufferedImage, int texID, boolean par3, boolean par4) {
		GlStateManager.bindTexture(texID);
		GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MIN_FILTER, GL11.GL_NEAREST);
		GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MAG_FILTER, GL11.GL_NEAREST);

		if (par3) {
			GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MIN_FILTER, GL11.GL_LINEAR);
			GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MAG_FILTER, GL11.GL_LINEAR);
		}

		if (par4) {
			GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_S, GL11.GL_CLAMP);
			GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_T, GL11.GL_CLAMP);
		} else {
			GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_S, GL11.GL_REPEAT);
			GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_T, GL11.GL_REPEAT);
		}

		int var5 = par1BufferedImage.getWidth();
		int var6 = par1BufferedImage.getHeight();
		int[] var7 = new int[var5 * var6];
		par1BufferedImage.getRGB(0, 0, var5, var6, var7, 0, var5);

		fixTransparency(var7);
		checkImageDataSize(var7.length);
		imageData.clear();
		imageData.put(var7);
		imageData.position(0).limit(var7.length);
		GL11.glTexImage2D(GL11.GL_TEXTURE_2D, 0, GL11.GL_RGBA, var5, var6, 0, GL12.GL_BGRA, GL12.GL_UNSIGNED_INT_8_8_8_8_REV, imageData);
	}

	// from 1.5.2 RenderEngine
	private void fixTransparency(int[] var1) {
		for (int var2 = 0; var2 < var1.length; ++var2) {
			int var3 = var1[var2] >> 24 & 255;

			if (var3 == 0) {
				var1[var2] = 0;
			}
		}
	}

	// from 1.5.2 TextureUtils
	/*
	* Rounds up the value to the nearest higher power ^ 2 value.
	* @param x
	* @return power ^ 2 value
	*/
	private int ceilPowerOfTwo(final int x) {
		int pow2 = 1;
		while (pow2 < x) {
			pow2 <<= 1;
		}
		return pow2;
	}
}
