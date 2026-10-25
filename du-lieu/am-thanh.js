/* ============================================================
   BẢNG ÂM THANH – Toán 4 Phiêu Lưu (sửa bằng Notepad, lưu UTF-8)
   Mỗi dòng:  File (trong thư mục am-thanh)  |  Câu trong app
   - Nhiều file cho cùng một câu: cách nhau bằng dấu ;  (app chọn ngẫu nhiên).
   - Cột 2 bắt đầu bằng @truyen:<mã>:<trai|gai> là lời truyện trong cot-truyen.js.
   - Câu nào không có dòng ở đây thì app dùng giọng đọc của máy (nếu bật Đọc to).
   - Thêm file mới: chép mp3 vào am-thanh, thêm 1 dòng ở đây.
   - Dòng bắt đầu bằng '# (THIẾU FILE mp3' là câu chưa có file trong thư mục am-thanh: app bỏ qua dòng đó
     và dùng giọng đọc của máy (nếu bật Đọc to). Chép file mp3 vào rồi xoá dấu # để dùng lại.
   ============================================================ */
window.BANG_AM_THANH = `
10_file_am_thanh_cong_tru_game/01_cong_khong_co_o_nho.ogg | Hàng đơn vị không có ô nhớ. Con tính từ phải sang trái nhé.
10_file_am_thanh_cong_tru_game/02_cong_nho_sang_hang_trai.ogg | Được từ mười trở lên thì viết chữ số hàng đơn vị, nhớ một vào ô Nhớ của hàng bên trái.
10_file_am_thanh_cong_tru_game/03_cong_ghi_so_nho.ogg | Đúng rồi! Viết chữ số hàng đơn vị, ghi số nhớ vào ô đang nhấp nháy.
10_file_am_thanh_cong_tru_game/04_tru_khong_co_o_muon.ogg | Hàng đơn vị không có ô mượn. Con tính từ phải sang trái nhé.
10_file_am_thanh_cong_tru_game/05_tru_muon_mot_chuc.ogg | Số trên bé hơn số dưới thì mượn một chục, thành mười mấy rồi trừ.
10_file_am_thanh_cong_tru_game/06_tru_tra_mot_da_muon.ogg | Vì đã mượn một nên phải trả: ghi một vào ô Mượn đang nhấp nháy, sang hàng bên trái cộng thêm một vào số trừ.
10_file_am_thanh_cong_tru_game/07_tru_quen_tra_mot.ogg | Con quên trả một đã mượn. Ô Mượn phía trên còn trống.
10_file_am_thanh_cong_tru_game/08_cong_quen_so_nho.ogg | Con quên số nhớ ở ô phía trên.
10_file_am_thanh_cong_tru_game/09_hoan_tat_bam_kiem_tra.ogg | Con điền xong rồi. Bấm nút Kiểm tra nhé.
10_file_am_thanh_cong_tru_game/10_chua_dung_xem_lai_hang.ogg | Chưa đúng. Con xem lại hàng này nhé.
13_file_am_thanh_huong_dan_game/01_gan_dung_roi_thu_lai_nhe.ogg | Gần đúng rồi, thử lại nhé!
13_file_am_thanh_huong_dan_game/02_chua_dung_kiem_tra_tung_buoc.ogg | Chưa đúng, con kiểm tra lại từng bước nhé.
13_file_am_thanh_huong_dan_game/03_dung_lo_thu_lai_lan_nua.ogg | Đừng lo, thử lại một lần nữa nào!
13_file_am_thanh_huong_dan_game/04_chua_dung_thu_lai_nhe.ogg | Chưa đúng, thử lại nhé!
13_file_am_thanh_huong_dan_game/05_doc_ky_de_gach_chan_cac_so.ogg | Đọc kĩ đề, gạch chân các số và xem đề hỏi gì.
13_file_am_thanh_huong_dan_game/06_chon_mot_dap_an_nhe.ogg | Chọn một đáp án nhé
13_file_am_thanh_huong_dan_game/07_nhap_dap_an_vao_o_nhe.ogg | Nhập đáp án vào ô nhé
13_file_am_thanh_huong_dan_game/08_dien_tu_so_va_mau_so_nhe.ogg | Điền cả tử số và mẫu số nhé
13_file_am_thanh_huong_dan_game/09_chua_sao_cung_hoc_bai_nay.ogg | Chưa sao! Mình cùng học bài này nhé.
13_file_am_thanh_huong_dan_game/10_da_thu_ba_lan_roi.ogg | Hôm nay con đã thử 3 lần rồi, học bài này hoặc mai thử lại nhé
13_file_am_thanh_huong_dan_game/11_lam_xong_buoc_truoc.ogg | Làm xong bước trước để mở mức này nhé
13_file_am_thanh_huong_dan_game/12_hoc_cach_lam_truoc.ogg | Con học cách làm trước nhé
13_file_am_thanh_huong_dan_game/13_qua_muc_de_de_gap_trum.ogg | Qua mức Dễ của mọi bài trong vùng để gặp trùm nhé
22_file_am_thanh_game/01_gioi_qua.ogg | Giỏi quá!
22_file_am_thanh_game/02_chinh_xac.ogg | Chính xác!
22_file_am_thanh_game/03_tuyet_voi.ogg | Tuyệt vời!
22_file_am_thanh_game/04_con_lam_rat_tot.ogg | Con làm rất tốt!
22_file_am_thanh_game/05_dung_roi_sieu_qua.ogg | Đúng rồi, siêu quá!
22_file_am_thanh_game/06_dung_roi.ogg | Đúng rồi!
22_file_am_thanh_game/07_con_lam_lai_la_dung_roi_do.ogg | Con làm lại là đúng rồi đó!
22_file_am_thanh_game/08_con_da_hieu_dang_nay_roi.ogg | Con đã hiểu dạng này rồi!
22_file_am_thanh_game/09_hoan_hao.ogg | Hoàn hảo!
22_file_am_thanh_game/10_con_da_vuot_qua.ogg | Con đã vượt qua!
22_file_am_thanh_game/11_con_lam_duoc_roi_chi_thieu_mot_chut_nua_thoi.ogg | Con làm được rồi, chỉ thiếu một chút nữa thôi!
22_file_am_thanh_game/12_minh_thu_lai_tu_tu_nhe.ogg | Mình thử lại từ từ nhé!
22_file_am_thanh_game/13_con_xong_ca_ba_nhiem_vu_hom_nay_roi.ogg | Con xong cả ba nhiệm vụ hôm nay rồi.
22_file_am_thanh_game/14_thuong_them_hai_ngoi_sao_nhe.ogg | Thưởng thêm hai ngôi sao nhé!
22_file_am_thanh_game/15_con_da_biet_roi.ogg | Con đã biết rồi.
22_file_am_thanh_game/16_bai_nay_duoc_mo_khoa_het.ogg | Bài này được mở khóa hết.
22_file_am_thanh_game/17_con_vua_mo_khoa_mot_mon_qua_moi.ogg | Con vừa mở khóa một món quà mới!
22_file_am_thanh_game/18_con_dang_lam_rat_tot_co_len_nao.ogg | Con đang làm rất tốt, cố lên nào!
22_file_am_thanh_game/19_moi_ngay_mot_chut_con_se_gioi_dan_len.ogg | Mỗi ngày một chút, con sẽ giỏi dần lên!
22_file_am_thanh_game/20_sai_cung_khong_sao_minh_hoc_tu_cho_sai_ma.ogg | Sai cũng không sao, mình học từ chỗ sai mà.
22_file_am_thanh_game/21_con_kien_tri_qua_co_khen_con.ogg | Con kiên trì quá, cô khen con!
22_file_am_thanh_game/22_nghi_mot_chut_roi_minh_lam_tiep_nhe.ogg | Nghỉ một chút rồi mình làm tiếp nhé!
44_file_am_thanh_nhan_vat_game/01_bin_xin_di_cung_con_tren_phi_thuyen.ogg | Bin xin đi cùng con trên phi thuyền!
44_file_am_thanh_nhan_vat_game/02_tun_muon_lam_ban_dong_hanh_cua_con.ogg | Tũn muốn làm bạn đồng hành của con!
44_file_am_thanh_nhan_vat_game/03_kai_gia_nhap_doi_tham_hiem.ogg | Kai gia nhập đội thám hiểm!
44_file_am_thanh_nhan_vat_game/04_con_co_them_anh_dai_dien_moi.ogg | Con có thêm ảnh đại diện mới!
44_file_am_thanh_nhan_vat_game/05_con_doc_so_lon_gioi_lam.ogg | Con đọc số lớn giỏi lắm!
44_file_am_thanh_nhan_vat_game/06_cong_tru_chuan_nhu_phi_cong.ogg | Cộng trừ chuẩn như phi công!
44_file_am_thanh_nhan_vat_game/07_san_sang_vao_rung.ogg | Sẵn sàng vào rừng!
44_file_am_thanh_nhan_vat_game/08_lam_tron_chuan_ghe.ogg | Làm tròn chuẩn ghê!
44_file_am_thanh_nhan_vat_game/09_phi_thuyen_da_co_lai_dong_co.ogg | Phi thuyền đã có lại động cơ!
44_file_am_thanh_nhan_vat_game/10_bip_vay_duoi_chao_con.ogg | Bíp vẫy đuôi chào con!
# (THIẾU FILE mp3 – có file thì xoá dấu # ở đầu dòng) 44_file_am_thanh_nhan_vat_game/11_bo_vay_moi_da_vao_tu_do_cua_con.mp3 ; 44_file_am_thanh_nhan_vat_game/15_bo_vay_moi_da_vao_tu_do_cua_con.mp3 ; 44_file_am_thanh_nhan_vat_game/20_bo_vay_moi_da_vao_tu_do_cua_con.mp3 ; 44_file_am_thanh_nhan_vat_game/24_bo_vay_moi_da_vao_tu_do_cua_con.mp3 ; 44_file_am_thanh_nhan_vat_game/28_bo_vay_moi_da_vao_tu_do_cua_con.mp3 ; 44_file_am_thanh_nhan_vat_game/29_bo_vay_moi_da_vao_tu_do_cua_con.mp3 ; 44_file_am_thanh_nhan_vat_game/30_bo_vay_moi_da_vao_tu_do_cua_con.mp3 ; 44_file_am_thanh_nhan_vat_game/35_bo_vay_moi_da_vao_tu_do_cua_con.mp3 ; 44_file_am_thanh_nhan_vat_game/36_bo_vay_moi_da_vao_tu_do_cua_con.mp3 | Bộ váy mới đã vào tủ đồ của con!
# (THIẾU FILE mp3 – có file thì xoá dấu # ở đầu dòng) 44_file_am_thanh_nhan_vat_game/12_phu_kien_di_cung_vay_denim_xinh.mp3 ; 44_file_am_thanh_nhan_vat_game/13_phu_kien_di_cung_vay_denim_xinh.mp3 ; 44_file_am_thanh_nhan_vat_game/14_phu_kien_di_cung_vay_denim_xinh.mp3 | Phụ kiện đi cùng váy Denim xinh.
# (THIẾU FILE mp3 – có file thì xoá dấu # ở đầu dòng) 44_file_am_thanh_nhan_vat_game/16_phu_kien_di_cung_vay_xanh_la_kem.mp3 ; 44_file_am_thanh_nhan_vat_game/17_phu_kien_di_cung_vay_xanh_la_kem.mp3 ; 44_file_am_thanh_nhan_vat_game/18_phu_kien_di_cung_vay_xanh_la_kem.mp3 ; 44_file_am_thanh_nhan_vat_game/19_phu_kien_di_cung_vay_xanh_la_kem.mp3 | Phụ kiện đi cùng váy Xanh lá kem.
# (THIẾU FILE mp3 – có file thì xoá dấu # ở đầu dòng) 44_file_am_thanh_nhan_vat_game/21_phu_kien_di_cung_vay_tim_lavender.mp3 ; 44_file_am_thanh_nhan_vat_game/22_phu_kien_di_cung_vay_tim_lavender.mp3 ; 44_file_am_thanh_nhan_vat_game/23_phu_kien_di_cung_vay_tim_lavender.mp3 | Phụ kiện đi cùng váy Tím lavender.
# (THIẾU FILE mp3 – có file thì xoá dấu # ở đầu dòng) 44_file_am_thanh_nhan_vat_game/25_phu_kien_di_cung_vay_hong_to_it.mp3 ; 44_file_am_thanh_nhan_vat_game/26_phu_kien_di_cung_vay_hong_to_it.mp3 ; 44_file_am_thanh_nhan_vat_game/27_phu_kien_di_cung_vay_hong_to_it.mp3 | Phụ kiện đi cùng váy Hồng tweed.
# (THIẾU FILE mp3 – có file thì xoá dấu # ở đầu dòng) 44_file_am_thanh_nhan_vat_game/31_phu_kien_di_cung_vay_hong_corset_den.mp3 ; 44_file_am_thanh_nhan_vat_game/32_phu_kien_di_cung_vay_hong_corset_den.mp3 ; 44_file_am_thanh_nhan_vat_game/33_phu_kien_di_cung_vay_hong_corset_den.mp3 ; 44_file_am_thanh_nhan_vat_game/34_phu_kien_di_cung_vay_hong_corset_den.mp3 | Phụ kiện đi cùng váy Hồng corset đen.
44_file_am_thanh_nhan_vat_game/37_hom_nay_minh_mac_gi_nhi.ogg | Hôm nay mình mặc gì nhỉ?
44_file_am_thanh_nhan_vat_game/38_minh_thich_bo_do_be_chon.ogg | Mình thích bộ đồ bé chọn!
44_file_am_thanh_nhan_vat_game/39_minh_san_sang_thu_mon_tiep_theo.ogg | Mình sẵn sàng thử món tiếp theo!
44_file_am_thanh_nhan_vat_game/40_mon_nay_dang_khoa_hoc_bai_de_nhan_nhe.ogg | Món này đang khoá. Học bài để nhận nhé!
44_file_am_thanh_nhan_vat_game/42_gap_trung_ngay.ogg | Gặp trùm ngay.
44_file_am_thanh_nhan_vat_game/43_con_da_lay_het_qua_chinh_roi_thu_muc_kho_hoac_toan_vui_de.ogg | Con đã lấy hết quà chính rồi! Thử mức Khó hoặc Toán vui để giỏi hơn nữa nhé.
44_file_am_thanh_nhan_vat_game/44_con_nhap_ten_cua_minh_nhe.ogg | Con nhập tên của mình nhé.
78_file_am_thanh_phieu_luu_toan_lop_4/002_bong_may_lon_xon_ap_toi_thoi_tung_moi_con_so_phi_thuyen_ph.ogg | @truyen:mo2:trai
78_file_am_thanh_phieu_luu_toan_lop_4/003_cu_ti_dung_lo_moi_bai_toan_con_lam_dung_se_tim_lai_mot_mon.ogg | @truyen:mo3:trai
78_file_am_thanh_phieu_luu_toan_lop_4/004_ruong_kho_bau_bi_khoa_bang_nhung_con_so_lon_doc_dung_so_ti.ogg | @truyen:vung:so:vao:trai
78_file_am_thanh_phieu_luu_toan_lop_4/005_cua_giu_ruong_gio_hai_cang_muon_lay_dong_co_thi_giai_het_c.ogg | @truyen:vung:so:trumloi:trai
78_file_am_thanh_phieu_luu_toan_lop_4/006_cua_giu_ruong_het_doi_tra_lai_dong_co_phi_thuyen_cho_con.ogg | @truyen:vung:so:xong:trai
78_file_am_thanh_phieu_luu_toan_lop_4/007_suong_mu_phu_kin_khu_rung_cac_bien_chi_duong_deu_viet_bang.ogg | @truyen:vung:toan:vao:trai
78_file_am_thanh_phieu_luu_toan_lop_4/008_cau_do_chu_nheo_mat_doc_ky_tung_chu_nhe_ta_hay_giau_bay_tr.ogg | @truyen:vung:toan:trumloi:trai
78_file_am_thanh_phieu_luu_toan_lop_4/009_cau_do_chu_chiu_thua_ban_bin_sa_mac_xin_di_cung_doi_tham_h.ogg | @truyen:vung:toan:xong:trai
78_file_am_thanh_phieu_luu_toan_lop_4/010_tram_duoi_bien_sap_het_binh_khi_phai_chia_that_deu_cho_moi.ogg | @truyen:vung:ps:vao:trai
78_file_am_thanh_phieu_luu_toan_lop_4/011_bach_tuoc_tam_phan_vung_tam_xuc_tu_chia_phan_cho_deu_thi_t.ogg | @truyen:vung:ps:trumloi:trai
78_file_am_thanh_phieu_luu_toan_lop_4/012_bach_tuoc_vui_ve_tro_lai_chu_cho_robot_bip_nhay_ra_theo_co.ogg | @truyen:vung:ps:xong:trai
78_file_am_thanh_phieu_luu_toan_lop_4/013_lap_lai_phi_thuyen_can_dung_goc_dung_can_nang_dung_thoi_gi.ogg | @truyen:vung:hinh:vao:trai
78_file_am_thanh_phieu_luu_toan_lop_4/014_robot_lon_xon_keu_bip_bip_oc_vit_cua_ta_bi_lan_het_roi_do.ogg | @truyen:vung:hinh:trumloi:trai
78_file_am_thanh_phieu_luu_toan_lop_4/015_robot_lon_xon_chay_em_ru_ban_kai_lua_do_gia_nhap_doi.ogg | @truyen:vung:hinh:xong:trai
78_file_am_thanh_phieu_luu_toan_lop_4/016_mu_phi_cong_bi_khoa_trong_ruong_so_doc_dung_hang_va_lop_la.ogg | @truyen:bai:place:trai
78_file_am_thanh_phieu_luu_toan_lop_4/017_la_ban_vang_chi_hien_ra_khi_con_lam_tron_so_that_chuan.ogg | @truyen:bai:round:trai
78_file_am_thanh_phieu_luu_toan_lop_4/018_kinh_bay_bi_roi_giua_hai_cot_so_cong_tru_cho_dung_de_nhat.ogg | @truyen:bai:addsub:trai
78_file_am_thanh_phieu_luu_toan_lop_4/019_huy_hieu_sao_nam_sau_canh_cua_phep_nhan.ogg | @truyen:bai:mul:trai
78_file_am_thanh_phieu_luu_toan_lop_4/020_bin_gui_tam_anh_trong_mot_cau_do_tinh_nhanh.ogg | @truyen:bai:quick:trai
78_file_am_thanh_phieu_luu_toan_lop_4/021_ban_do_dien_tu_chi_bat_len_khi_chia_dung.ogg | @truyen:bai:div:trai
78_file_am_thanh_phieu_luu_toan_lop_4/022_mu_tham_hiem_treo_tren_cay_tim_so_trung_binh_cong_de_voi_t.ogg | @truyen:bai:avg:trai
78_file_am_thanh_phieu_luu_toan_lop_4/023_bo_do_tham_hiem_cat_trong_kho_rut_ve_don_vi_de_biet_can_ba.ogg | @truyen:bai:unit:trai
78_file_am_thanh_phieu_luu_toan_lop_4/024_tun_nhan_tim_duoc_hai_so_bi_mat_thi_minh_gui_anh_cho_ban.ogg | @truyen:bai:sumdiff:trai
78_file_am_thanh_phieu_luu_toan_lop_4/025_toan_vui_dem_cay_ven_duong_de_tim_vong_co_cun.ogg | @truyen:bai:trees:trai
78_file_am_thanh_phieu_luu_toan_lop_4/026_toan_vui_giup_bac_nong_dan_dem_ga_va_tho_de_nhan_mu_cun_xa.ogg | @truyen:bai:chick:trai
78_file_am_thanh_phieu_luu_toan_lop_4/027_mu_phi_hanh_gia_troi_duoi_bien_hieu_phan_so_la_boi_toi_duo.ogg | @truyen:bai:frac:trai
78_file_am_thanh_phieu_luu_toan_lop_4/028_ba_lo_phan_luc_bi_nang_qua_rut_gon_phan_so_cho_nhe_di.ogg | @truyen:bai:simplify:trai
78_file_am_thanh_phieu_luu_toan_lop_4/029_bo_dang_so_sanh_cac_binh_khi_giup_bo_nhe.ogg | @truyen:bai:fraccmp:trai
78_file_am_thanh_phieu_luu_toan_lop_4/030_canh_pha_le_ghep_tu_nhieu_manh_phan_so.ogg | @truyen:bai:fraddsub:trai
78_file_am_thanh_phieu_luu_toan_lop_4/031_cu_mi_bi_ket_trong_bong_bong_phan_so_nhan_chia_dung_de_cuu.ogg | @truyen:bai:fracmul:trai
78_file_am_thanh_phieu_luu_toan_lop_4/032_canh_robot_can_lap_dung_goc.ogg | @truyen:bai:angle:trai
78_file_am_thanh_phieu_luu_toan_lop_4/033_bo_do_phi_hanh_gia_may_tu_nhung_duong_thang_song_song_va_v.ogg | @truyen:bai:lines:trai
78_file_am_thanh_phieu_luu_toan_lop_4/034_mu_phu_thuy_sao_giau_trong_hinh_binh_hanh.ogg | @truyen:bai:hbh:trai
78_file_am_thanh_phieu_luu_toan_lop_4/035_vuong_mien_sao_nang_bao_nhieu_doi_dung_yen_ta_tan_nhe.ogg | @truyen:bai:mass:trai
78_file_am_thanh_phieu_luu_toan_lop_4/036_soi_con_can_lat_san_xuong_tinh_dien_tich_giup_ban_ay.ogg | @truyen:bai:area:trai
78_file_am_thanh_phieu_luu_toan_lop_4/037_kai_hen_gio_phong_ten_lua_doi_dung_giay_phut_the_ky_nao.ogg | @truyen:bai:time:trai
78_file_am_thanh_phieu_luu_toan_lop_4/038_tun_ve_bieu_do_so_oc_vit_doc_dung_bieu_do_de_tun_nhap_doi.ogg | @truyen:bai:chart:trai
78_file_am_thanh_phieu_luu_toan_lop_4/039_phi_thuyen_tri_thuc_da_sua_xong_ten_cu_ti_va_cac_ban_cat_c.ogg | @truyen:ket:trai
78_file_am_thanh_phieu_luu_toan_lop_4/041_bong_may_lon_xon_bay_qua_tron_tung_moi_con_so_phep_mau_tat.ogg | @truyen:mo2:gai
78_file_am_thanh_phieu_luu_toan_lop_4/042_cu_mi_moi_bai_toan_con_lam_dung_se_thap_lai_mot_chut_phep.ogg | @truyen:mo3:gai
78_file_am_thanh_phieu_luu_toan_lop_4/043_canh_cong_lau_dai_co_o_khoa_so_doc_dung_tinh_dung_la_cong.ogg | @truyen:vung:so:vao:gai
78_file_am_thanh_phieu_luu_toan_lop_4/044_guong_than_dao_so_lap_lanh_ta_dao_het_cac_con_so_roi_con_s.ogg | @truyen:vung:so:trumloi:gai
78_file_am_thanh_phieu_luu_toan_lop_4/045_guong_than_sang_tro_lai_mot_bo_vay_moi_hien_ra_trong_tu_do.ogg | @truyen:vung:so:xong:gai
78_file_am_thanh_phieu_luu_toan_lop_4/046_ban_ki_lan_gui_nhung_cau_do_bang_loi_giai_xong_cau_vong_se.ogg | @truyen:vung:toan:vao:gai
78_file_am_thanh_phieu_luu_toan_lop_4/047_ki_lan_do_vui_lac_bom_doc_ky_de_nhe_cau_do_cua_ta_nhieu_bu.ogg | @truyen:vung:toan:trumloi:gai
78_file_am_thanh_phieu_luu_toan_lop_4/048_cau_vong_hien_ra_mot_bo_vay_moi_bay_ve_tu_do_cua_luna.ogg | @truyen:vung:toan:xong:gai
78_file_am_thanh_phieu_luu_toan_lop_4/049_banh_cho_khach_da_hoi_phai_chia_that_deu_do_chinh_la_phan.ogg | @truyen:vung:ps:vao:gai
78_file_am_thanh_phieu_luu_toan_lop_4/050_banh_kem_khong_lo_rung_rinh_chia_ta_cho_deu_thi_moi_duoc_a.ogg | @truyen:vung:ps:trumloi:gai
78_file_am_thanh_phieu_luu_toan_lop_4/051_banh_da_chia_deu_mot_bo_vay_moi_den_chung_vui_voi_luna.ogg | @truyen:vung:ps:xong:gai
78_file_am_thanh_phieu_luu_toan_lop_4/052_may_vay_da_hoi_can_do_that_chuan_cat_that_dung_hinh_cung_l.ogg | @truyen:vung:hinh:vao:gai
78_file_am_thanh_phieu_luu_toan_lop_4/053_may_may_lon_xon_keu_tach_tach_chi_cua_ta_roi_het_roi_do_gi.ogg | @truyen:vung:hinh:trumloi:gai
78_file_am_thanh_phieu_luu_toan_lop_4/054_may_may_chay_em_bo_vay_cuoi_da_may_xong_cho_luna.ogg | @truyen:vung:hinh:xong:gai
78_file_am_thanh_phieu_luu_toan_lop_4/055_mot_mon_trang_suc_dang_ket_tren_cong_so_doc_dung_hang_va_l.ogg | @truyen:bai:place:gai
78_file_am_thanh_phieu_luu_toan_lop_4/056_mon_do_sang_lap_lanh_khi_con_lam_tron_so_that_chuan.ogg | @truyen:bai:round:gai
78_file_am_thanh_phieu_luu_toan_lop_4/057_mon_do_xinh_no_ra_khi_con_cong_tru_dung.ogg | @truyen:bai:addsub:gai
78_file_am_thanh_phieu_luu_toan_lop_4/058_mon_do_quy_cat_sau_canh_cua_phep_nhan.ogg | @truyen:bai:mul:gai
78_file_am_thanh_phieu_luu_toan_lop_4/059_mot_mon_do_nho_dang_doi_sau_cau_do_tinh_nhanh.ogg | @truyen:bai:quick:gai
78_file_am_thanh_phieu_luu_toan_lop_4/060_mon_do_duoc_chia_deu_cho_cac_ban_chia_dung_la_nhan_duoc.ogg | @truyen:bai:div:gai
78_file_am_thanh_phieu_luu_toan_lop_4/061_mon_do_hien_ra_khi_con_tim_dung_so_trung_binh_cong.ogg | @truyen:bai:avg:gai
78_file_am_thanh_phieu_luu_toan_lop_4/062_vay_da_hoi_dang_may_do_rut_ve_don_vi_de_biet_can_bao_nhieu.ogg | @truyen:bai:unit:gai
78_file_am_thanh_phieu_luu_toan_lop_4/063_mon_do_giau_hai_so_bi_mat_tim_ra_hai_so_la_mo_duoc.ogg | @truyen:bai:sumdiff:gai
78_file_am_thanh_phieu_luu_toan_lop_4/064_toan_vui_trong_hoa_ven_duong_de_tim_mon_do_an.ogg | @truyen:bai:trees:gai
78_file_am_thanh_phieu_luu_toan_lop_4/065_toan_vui_dem_ga_va_tho_trong_vuon_de_nhan_mon_do.ogg | @truyen:bai:chick:gai
78_file_am_thanh_phieu_luu_toan_lop_4/066_mon_do_nam_trong_tui_nhung_mieng_banh_phan_so.ogg | @truyen:bai:frac:gai
78_file_am_thanh_phieu_luu_toan_lop_4/067_mon_do_sang_hon_khi_phan_so_gon_gang.ogg | @truyen:bai:simplify:gai
78_file_am_thanh_phieu_luu_toan_lop_4/068_hai_mon_do_dang_tranh_nhau_so_sanh_phan_so_de_biet_mon_nao.ogg | @truyen:bai:fraccmp:gai
78_file_am_thanh_phieu_luu_toan_lop_4/069_chuong_ngan_len_khi_cong_tru_phan_so_dung_mon_do_se_hien_r.ogg | @truyen:bai:fraddsub:gai
78_file_am_thanh_phieu_luu_toan_lop_4/070_mon_do_bi_ket_trong_hop_banh_nhan_chia_phan_so_de_mo_hop.ogg | @truyen:bai:fracmul:gai
78_file_am_thanh_phieu_luu_toan_lop_4/071_mon_do_may_theo_goc_do_goc_dung_de_nhan_nhe.ogg | @truyen:bai:angle:gai
78_file_am_thanh_phieu_luu_toan_lop_4/072_mon_do_may_tu_nhung_duong_song_song_va_vuong_goc.ogg | @truyen:bai:lines:gai
78_file_am_thanh_phieu_luu_toan_lop_4/073_chia_khoa_vang_co_hinh_binh_hanh_mo_khoa_la_co_mon_do_moi.ogg | @truyen:bai:hbh:gai
78_file_am_thanh_phieu_luu_toan_lop_4/074_can_vai_da_hoi_cho_dung_doi_dung_yen_ta_tan_la_nhan_mon_do.ogg | @truyen:bai:mass:gai
78_file_am_thanh_phieu_luu_toan_lop_4/075_tinh_dien_tich_tam_tham_dung_de_lay_mon_do_tren_do_nhe.ogg | @truyen:bai:area:gai
78_file_am_thanh_phieu_luu_toan_lop_4/076_da_hoi_bat_dau_dung_gio_xem_dong_ho_chuan_de_nhan_mon_do.ogg | @truyen:bai:time:gai
78_file_am_thanh_phieu_luu_toan_lop_4/077_mon_do_danh_cho_ai_doc_dung_bieu_do.ogg | @truyen:bai:chart:gai
78_file_am_thanh_phieu_luu_toan_lop_4/078_phep_mau_da_tro_lai_lau_dai_ky_dieu_da_hoi_anh_sao_bat_dau.ogg | @truyen:ket:gai
# Chưa dùng: 2 file đọc nhầm {ten} thành 'Ten' – nên thu lại bắt đầu bằng 'Con và Cú Tí…' / 'Con và Cú Mi…'
# 78_file_am_thanh_phieu_luu_toan_lop_4/001_ten_va_cu_ti_lai_phi_thuyen_tri_thuc_cho_vien_ngoc_con_so.mp3 | @truyen:mo1:trai
# 78_file_am_thanh_phieu_luu_toan_lop_4/040_ten_va_cu_mi_dang_chuan_bi_da_hoi_anh_sao_o_lau_dai_ky_die.mp3 | @truyen:mo1:gai
moi/truyen_ten_the_gioi_trai.ogg | @truyen:ten-the-gioi:trai
moi/truyen_cu_trai.ogg | @truyen:cu:trai
moi/truyen_phong_trai.ogg | @truyen:phong:trai
moi/truyen_mo1_trai.ogg | @truyen:mo1:trai
moi/truyen_vung_so_ten_trai.ogg | @truyen:vung:so:ten:trai
moi/truyen_vung_so_phu_trai.ogg | @truyen:vung:so:phu:trai
moi/truyen_vung_so_trum_trai.ogg | @truyen:vung:so:trum:trai
moi/truyen_vung_toan_ten_trai.ogg | @truyen:vung:toan:ten:trai
moi/truyen_vung_toan_phu_trai.ogg | @truyen:vung:toan:phu:trai
moi/truyen_vung_toan_trum_trai.ogg | @truyen:vung:toan:trum:trai
moi/truyen_vung_ps_ten_trai.ogg | @truyen:vung:ps:ten:trai
moi/truyen_vung_ps_phu_trai.ogg | @truyen:vung:ps:phu:trai
moi/truyen_vung_ps_trum_trai.ogg | @truyen:vung:ps:trum:trai
moi/truyen_vung_hinh_ten_trai.ogg | @truyen:vung:hinh:ten:trai
moi/truyen_vung_hinh_phu_trai.ogg | @truyen:vung:hinh:phu:trai
moi/truyen_vung_hinh_trum_trai.ogg | @truyen:vung:hinh:trum:trai
moi/truyen_bai_cmpnum_trai.ogg | @truyen:bai:cmpnum:trai
moi/truyen_bai_x10_trai.ogg | @truyen:bai:x10:trai
moi/truyen_bai_fracdiv_trai.ogg | @truyen:bai:fracdiv:trai
moi/truyen_bai_fracprop_trai.ogg | @truyen:bai:fracprop:trai
moi/truyen_bai_fracof_trai.ogg | @truyen:bai:fracof:trai
moi/truyen_bai_protract_trai.ogg | @truyen:bai:protract:trai
moi/truyen_bai_datalist_trai.ogg | @truyen:bai:datalist:trai
moi/truyen_bai_freq_trai.ogg | @truyen:bai:freq:trai
moi/truyen_ten_the_gioi_gai.ogg | @truyen:ten-the-gioi:gai
moi/truyen_cu_gai.ogg | @truyen:cu:gai
moi/truyen_phong_gai.ogg | @truyen:phong:gai
moi/truyen_mo1_gai.ogg | @truyen:mo1:gai
moi/truyen_vung_so_ten_gai.ogg | @truyen:vung:so:ten:gai
moi/truyen_vung_so_phu_gai.ogg | @truyen:vung:so:phu:gai
moi/truyen_vung_so_trum_gai.ogg | @truyen:vung:so:trum:gai
moi/truyen_vung_toan_ten_gai.ogg | @truyen:vung:toan:ten:gai
moi/truyen_vung_toan_phu_gai.ogg | @truyen:vung:toan:phu:gai
moi/truyen_vung_toan_trum_gai.ogg | @truyen:vung:toan:trum:gai
moi/truyen_vung_ps_ten_gai.ogg | @truyen:vung:ps:ten:gai
moi/truyen_vung_ps_phu_gai.ogg | @truyen:vung:ps:phu:gai
moi/truyen_vung_ps_trum_gai.ogg | @truyen:vung:ps:trum:gai
moi/truyen_vung_hinh_ten_gai.ogg | @truyen:vung:hinh:ten:gai
moi/truyen_vung_hinh_phu_gai.ogg | @truyen:vung:hinh:phu:gai
moi/truyen_vung_hinh_trum_gai.ogg | @truyen:vung:hinh:trum:gai
moi/truyen_bai_cmpnum_gai.ogg | @truyen:bai:cmpnum:gai
moi/truyen_bai_x10_gai.ogg | @truyen:bai:x10:gai
moi/truyen_bai_fracdiv_gai.ogg | @truyen:bai:fracdiv:gai
moi/truyen_bai_fracprop_gai.ogg | @truyen:bai:fracprop:gai
moi/truyen_bai_fracof_gai.ogg | @truyen:bai:fracof:gai
moi/truyen_bai_protract_gai.ogg | @truyen:bai:protract:gai
moi/truyen_bai_datalist_gai.ogg | @truyen:bai:datalist:gai
moi/truyen_bai_freq_gai.ogg | @truyen:bai:freq:gai
`;
