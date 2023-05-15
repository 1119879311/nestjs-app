/*
 Navicat Premium Data Transfer

 Source Server         : FFS
 Source Server Type    : MySQL
 Source Server Version : 50730
 Source Host           : localhost:3306
 Source Schema         : nestdbpro

 Target Server Type    : MySQL
 Target Server Version : 50730
 File Encoding         : 65001

 Date: 12/04/2023 22:41:53
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for query-result-cache
-- ----------------------------

CREATE TABLE If Not Exists `query-result-cache`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `time` bigint(20) NOT NULL,
  `duration` int(11) NOT NULL,
  `query` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `result` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tk_article
-- ----------------------------

CREATE TABLE If Not Exists `tk_article`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '简述',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '内容',
  `thumimg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片',
  `cid` int(11) NULL DEFAULT NULL COMMENT '分类',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '状态：1是启用，其他是禁用',
  `createtime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatetime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `operator_user_id` int(11) NULL DEFAULT NULL COMMENT '操作者id',
  `operator_tenant_id` int(11) NULL DEFAULT NULL COMMENT '操作者租户',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tk_article_tag
-- ----------------------------

CREATE TABLE  `tk_article_tag`  (
  `a_id` int(11) NOT NULL,
  `t_id` int(11) NOT NULL,
  PRIMARY KEY (`a_id`, `t_id`) USING BTREE,
  INDEX `IDX_322f2b284b39d03ecf244d486c`(`a_id`) USING BTREE,
  INDEX `IDX_ee5330b386544ed7bfcfc9fc63`(`t_id`) USING BTREE,
  CONSTRAINT `FK_322f2b284b39d03ecf244d486ca` FOREIGN KEY (`a_id`) REFERENCES `tk_article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ee5330b386544ed7bfcfc9fc63f` FOREIGN KEY (`t_id`) REFERENCES `tk_tag` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tk_authority
-- ----------------------------

CREATE TABLE If Not Exists `tk_authority`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '资源地址',
  `auth_type` int(11) NOT NULL COMMENT '资源类型：1是菜单(与前端关联),2是api接口(与后端关联),3页面路由',
  `pid` int(11) NULL DEFAULT 0 COMMENT '上级id',
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '状态：1是启用，其他是禁用',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `createtime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatetime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `operator_user_id` int(11) NULL DEFAULT NULL COMMENT '操作者id',
  `operator_tenant_id` int(11) NULL DEFAULT NULL COMMENT '操作者租户',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资源名称',
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '资源唯一标记',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_5bc9ced5f8fb68c88e551620af`(`code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tk_authority
-- ----------------------------
INSERT INTO `tk_authority` VALUES (1, NULL, 2, 0, 1, 0, '2023-04-08 21:54:25.611900', '2023-04-09 21:59:17.632459', NULL, NULL, '查看管理员', 'per-lookManager');
INSERT INTO `tk_authority` VALUES (2, NULL, 2, 0, 1, 0, '2023-04-08 21:56:57.075623', '2023-04-08 22:39:29.635545', NULL, NULL, '添加修改管理员', 'per-saveAuthority');

-- ----------------------------
-- Table structure for tk_classify
-- ----------------------------

CREATE TABLE If Not Exists `tk_classify`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'tab名称',
  `pid` int(11) NOT NULL DEFAULT 0 COMMENT '上级pid',
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '状态：1是启用，其他是禁用',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `createtime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatetime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `operator_user_id` int(11) NULL DEFAULT NULL COMMENT '操作者id',
  `operator_tenant_id` int(11) NULL DEFAULT NULL COMMENT '操作者租户',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_40aa0056daf5bd37e58b5b3db3`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tk_images
-- ----------------------------

CREATE TABLE If Not Exists `tk_images`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '标题',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '简述',
  `urls` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '图片',
  `cid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '分类',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '状态：1是启用，其他是禁用',
  `createtime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatetime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `operator_user_id` int(11) NULL DEFAULT NULL COMMENT '操作者id',
  `operator_tenant_id` int(11) NULL DEFAULT NULL COMMENT '操作者租户',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tk_message
-- ----------------------------

CREATE TABLE If Not Exists `tk_message`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '邮箱',
  `telephone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '号码',
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '内容',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '姓名',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '地址',
  `company` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '公司/组织',
  `createtime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `operator_user_id` int(11) NULL DEFAULT NULL COMMENT '操作者id',
  `operator_tenant_id` int(11) NULL DEFAULT NULL COMMENT '操作者租户',
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '状态：1是启用，其他是禁用',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `updatetime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tk_role
-- ----------------------------

CREATE TABLE If Not Exists `tk_role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色名称',
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '角色描述',
  `role_type` int(11) NOT NULL DEFAULT 2 COMMENT '角色类型1:系统预设,2:普通角色',
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '状态：1是启用，其他是禁用',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `createtime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatetime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `operator_user_id` int(11) NULL DEFAULT NULL COMMENT '操作者id',
  `operator_tenant_id` int(11) NULL DEFAULT NULL COMMENT '操作者租户',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_756d28b9fd5e8839ec1f08e117`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tk_role
-- ----------------------------
INSERT INTO `tk_role` VALUES (1, 'role_admin', NULL, 1, 1, 0, '2023-03-26 22:23:46.134432', '2023-04-09 23:23:53.659135', NULL, 1);
INSERT INTO `tk_role` VALUES (2, 'role_root', NULL, 1, 1, 0, '2023-04-08 21:57:52.145511', '2023-04-09 23:24:22.886701', NULL, 1);

-- ----------------------------
-- Table structure for tk_role_authority
-- ----------------------------

CREATE TABLE If Not Exists `tk_role_authority`  (
  `r_id` int(11) NOT NULL,
  `a_id` int(11) NOT NULL,
  PRIMARY KEY (`r_id`, `a_id`) USING BTREE,
  INDEX `IDX_8d33ad4f4ea6df1df7fe66e619`(`r_id`) USING BTREE,
  INDEX `IDX_b5583a03a0815f1e8e6678b0b4`(`a_id`) USING BTREE,
  CONSTRAINT `FK_8d33ad4f4ea6df1df7fe66e6196` FOREIGN KEY (`r_id`) REFERENCES `tk_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_b5583a03a0815f1e8e6678b0b4c` FOREIGN KEY (`a_id`) REFERENCES `tk_authority` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tk_role_authority
-- ----------------------------
INSERT INTO `tk_role_authority` VALUES (1, 1);
INSERT INTO `tk_role_authority` VALUES (1, 2);
INSERT INTO `tk_role_authority` VALUES (2, 1);

-- ----------------------------
-- Table structure for tk_tag
-- ----------------------------

CREATE TABLE If Not Exists `tk_tag`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'tab名称',
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '状态：1是启用，其他是禁用',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `createtime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatetime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `operator_user_id` int(11) NULL DEFAULT NULL COMMENT '操作者id',
  `operator_tenant_id` int(11) NULL DEFAULT NULL COMMENT '操作者租户',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_955ade9c76b4366da9691aa902`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tk_tenant
-- ----------------------------

CREATE TABLE If Not Exists `tk_tenant`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `operator_user_id` int(11) NULL DEFAULT NULL COMMENT '操作者id',
  `operator_tenant_id` int(11) NULL DEFAULT NULL COMMENT '操作者租户',
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '状态：1是启用，其他是禁用',
  `createtime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatetime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '租户名称',
  `data_access` int(11) NOT NULL DEFAULT 1 COMMENT '租户数据共存方式：1、用户私有化 ,2、租户内共享,3、公开',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '租户描述',
  `tenant_type` int(11) NOT NULL DEFAULT 2 COMMENT '租户类型1:系统预设,2:普通租户',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_8b82f57527697c68a553b14c71`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tk_tenant
-- ----------------------------
INSERT INTO `tk_tenant` VALUES (1, 1, 1, 1, '2023-03-26 21:38:41.797114', '2023-04-09 23:27:40.206276', 'tenant_admin', 1, 0, NULL, 2);
INSERT INTO `tk_tenant` VALUES (3, 1, 1, 1, '2023-03-26 21:48:00.178795', '2023-04-09 23:26:49.500342', 'tenant_system', 2, 0, NULL, 2);
INSERT INTO `tk_tenant` VALUES (5, 1, 1, 1, '2023-03-26 22:07:43.308354', '2023-04-09 23:26:50.195218', 'tenant_bran', 3, 0, NULL, 2);

-- ----------------------------
-- Table structure for tk_user
-- ----------------------------
CREATE TABLE If Not Exists `tk_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `operator_user_id` int(11) NULL DEFAULT NULL COMMENT '操作者id',
  `operator_tenant_id` int(11) NULL DEFAULT NULL COMMENT '操作者租户',
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '状态：1是启用，其他是禁用',
  `createtime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatetime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户密码',
  `user_type` int(11) NOT NULL DEFAULT 3 COMMENT '用户类型：1超级用户,2系统用户,3.普通用户,4.游客、测试用户',
  `contact` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '联系方式',
  `email` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `current_tenant` int(11) NULL DEFAULT NULL COMMENT '当前的选择的租户',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `user_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户key',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_5edb092ee716046e04d6fe6a08`(`name`) USING BTREE,
  UNIQUE INDEX `IDX_2045b1a8b54868effba9d0bb8d`(`contact`) USING BTREE,
  UNIQUE INDEX `IDX_1d2277a3bfeac3bbd86ac02b69`(`email`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tk_user
-- ----------------------------
INSERT INTO `tk_user` VALUES (1, NULL, 1, 1, '2023-03-26 23:04:22.667728', '2023-04-09 23:24:50.617117', 'root', '3aef9f0a7b5a826f1eb45f10c93abcfe82fa2d60a4c4611088b7d5c9e1e364a9', 1, NULL, NULL, NULL, 0, 'QZi-mTyUvmRFPrqm');
INSERT INTO `tk_user` VALUES (2, 1, 1, 1, '2023-03-26 23:06:22.543474', '2023-04-09 23:24:56.710604', 'admin', '2afb5787b8fdbb219a7e181ccfc5971f9268075f01dd830d92f128dc3b2ef372', 2, NULL, NULL, 1, 0, 'I2n3EmEFuRxLFXJJ');
INSERT INTO `tk_user` VALUES (3, 1, 1, 1, '2023-04-09 23:28:59.292393', '2023-04-09 23:29:37.319648', 'bran', '2ab2cd3fb35de34fdebe1c059e0c2aceb6f2b683db5907c1a1c824d121383141', 3, NULL, NULL, 5, 0, 'b3aSbDdayobKF72ly1aP_');

-- ----------------------------
-- Table structure for tk_user_role
-- ----------------------------

CREATE TABLE If Not Exists `tk_user_role`  (
  `u_id` int(11) NOT NULL,
  `r_id` int(11) NOT NULL,
  PRIMARY KEY (`u_id`, `r_id`) USING BTREE,
  INDEX `IDX_598ca6b8fcc220dfe6190f6f60`(`u_id`) USING BTREE,
  INDEX `IDX_543f5b9e944a72837108135354`(`r_id`) USING BTREE,
  CONSTRAINT `FK_543f5b9e944a728371081353549` FOREIGN KEY (`r_id`) REFERENCES `tk_role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_598ca6b8fcc220dfe6190f6f607` FOREIGN KEY (`u_id`) REFERENCES `tk_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tk_user_role
-- ----------------------------
INSERT INTO `tk_user_role` VALUES (1, 1);
INSERT INTO `tk_user_role` VALUES (2, 1);
INSERT INTO `tk_user_role` VALUES (2, 2);

-- ----------------------------
-- Table structure for tk_user_tenant
-- ----------------------------

CREATE TABLE If Not Exists `tk_user_tenant`  (
  `u_id` int(11) NOT NULL,
  `t_id` int(11) NOT NULL,
  PRIMARY KEY (`u_id`, `t_id`) USING BTREE,
  INDEX `IDX_8b9008281fc5769d6ca57eff7d`(`u_id`) USING BTREE,
  INDEX `IDX_0c4af1c5d8b1bdb09e8dce3a12`(`t_id`) USING BTREE,
  CONSTRAINT `FK_0c4af1c5d8b1bdb09e8dce3a128` FOREIGN KEY (`t_id`) REFERENCES `tk_tenant` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_8b9008281fc5769d6ca57eff7d4` FOREIGN KEY (`u_id`) REFERENCES `tk_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tk_user_tenant
-- ----------------------------
INSERT INTO `tk_user_tenant` VALUES (2, 1);
INSERT INTO `tk_user_tenant` VALUES (2, 3);
INSERT INTO `tk_user_tenant` VALUES (2, 5);
INSERT INTO `tk_user_tenant` VALUES (3, 5);

SET FOREIGN_KEY_CHECKS = 1;
